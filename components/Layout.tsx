import Sidebar from './Sidebar';

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <main>
      <section className="main">
        <div className="main__left">
          <Sidebar />
        </div>
        <div className="main__right">{ children }</div>
      </section>
    </main>
  );
}
