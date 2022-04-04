import axios from 'axios';
import { GetServerSidePropsContext } from 'next';

export default async function withAuth({ req }: GetServerSidePropsContext): Promise<any> {
  const token = req.cookies?.authorization;

  if (!token) {
    return {
      redirect: {
        permanent: true,
        destination: '/login',
      },
    };
  }

  try {
    const response = await axios.get(`http://${req.headers.host}/api/users/verify/${token}`, { withCredentials: true });
    const { data } = response;

    if (data?.success) {
      return { props: { user: data.payload } };
    } else {
      console.log('Message', data?.message);
      return {
        redirect: {
          permanent: true,
          destination: '/login',
        },
      };
    }
  } catch (error: any) {
    return {
      redirect: {
        permanent: true,
        destination: '/login',
      },
    };
  }
};
