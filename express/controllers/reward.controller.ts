import { Prisma, Reward, RewardType, QuestStatus } from '@prisma/client';

import prisma from '../lib/database';

export async function filter(itemNfts?: number[], materialIds?: number[]) {
  let conditions = Prisma.sql`"type" IN (${Prisma.join([RewardType.Item, RewardType.Material])})`;
  let others = Prisma.empty;

  if (typeof itemNfts !== 'undefined' && itemNfts?.length > 0) {
    const items = await prisma.item.findMany({ where: { itemNftId: { in: itemNfts } } });
    const itemIds = items.map(({ id }) => id);

    const condition = Prisma.sql`"itemId" IN (${Prisma.join(itemIds)})`;
    others = others.sql.length > 0 ? Prisma.sql`${others} OR ${condition}` : condition;
  }

  if (typeof materialIds !== 'undefined' && materialIds?.length > 0) {
    const condition = Prisma.sql`"materialId" IN (${Prisma.join(materialIds)})`;
    others = others.sql.length > 0 ? Prisma.sql`${others} OR ${condition}` : condition;
  }

  if (others.sql.length > 0) {
    conditions = Prisma.sql`${conditions} AND ${others}`;
  }

  const rewards: Reward[] = await prisma.$queryRaw`SELECT DISTINCT * FROM "Reward" WHERE ${conditions}`;
  const rewardIds = rewards.map((reward) => reward.id);

  const questRewards = await prisma.questReward.findMany({ where: { rewardId: { in: rewardIds } }, select: { questId: true } });
  const quests = await prisma.quest.findMany({ where: { id: { in: questRewards.map(({ questId }) => questId) }, isActive: true }, orderBy: { id: 'asc' } });

  return quests;
}

export async function claimed() {
  const itemsQuery = prisma.$queryRaw`SELECT i."id", i."name", i."displayName", i."itemNftId", calculated."quantity"
  FROM (SELECT "itemId", SUM(quantity) as quantity
  FROM "public"."ClaimHistoryNonce" chn
  WHERE "itemId" IS NOT NULL
  GROUP BY "itemId") as calculated
  JOIN "public"."Item" i on i."id" = calculated."itemId"
  ORDER BY i."itemNftId" ASC`;

  const materialsQuery = prisma.$queryRaw`SELECT m."name", calculated."quantity"
  FROM (SELECT "materialId", SUM(quantity) as quantity
  FROM "public"."ClaimHistoryNonce" chn
  WHERE "materialId" IS NOT NULL
  GROUP BY "materialId") as calculated
  JOIN "public"."Material" m on m."id" = calculated."materialId"
  ORDER BY m.id ASC`;

  const [items, materials] = await Promise.all([itemsQuery, materialsQuery]);

  return { items, materials };
}

export async function itemNftRewards() {
  const data: any[] = [];

  const quests: any[] = await prisma.$queryRaw`
  SELECT DISTINCT q."id", q."name", r."type", r."itemId", qr."quantity", i."id" AS "itemId", i."itemNftId", i."name", i."displayName"
  FROM "Quest" q
  JOIN "QuestReward" qr ON q."id" = qr."questId"
  JOIN "Reward" r ON r."id" = qr."rewardId"
  JOIN "Item" i ON i."id" = r."itemId"
  WHERE r."itemId" IS NOT NULL
  AND r."type" = ${RewardType.Item}
  AND q."isActive" = ${true}
  AND i."itemNftId" IS NOT NULL
  ORDER BY q.id ASC`;

  if (quests.length === 0) return data;

  const ids = quests.map((quest) => quest.id);
  const records: any[] = await prisma.$queryRaw`
  SELECT "questId", COUNT(*) AS finished
  FROM "UserQuest" uq
  WHERE "questId" IN (${Prisma.join(ids)})
  AND "status" = ${QuestStatus.Finished}
  GROUP BY "questId"`;

  for (let i = 0; i < quests.length; i++) {
    const quest = quests[i];
    const quantity = quest.quantity;
    const record = records.find((r) => r.questId === quest.id);

    data.push({
      questId: quest?.id,
      questName: quest?.name,
      itemId: quest?.itemId,
      itemNftId: quest?.itemNftId,
      itemName: quest?.name,
      itemDisplayName: quest?.displayName,
      finished: record?.finished,
      quantity: quantity,
      total: quantity * (record?.finished || 0)
    });
  }

  return data;
}

export async function materialRewards() {
  const data: any[] = [];

  const quests: any[] = await prisma.$queryRaw`
  SELECT DISTINCT q."id", q."name", r."type", r."materialId", qr."quantity", m."name" AS "materialName"
  FROM "Quest" q
  JOIN "QuestReward" qr ON q."id" = qr."questId"
  JOIN "Reward" r ON r."id" = qr."rewardId"
  JOIN "Material" m ON m."id" = r."materialId"
  WHERE r."materialId" IS NOT NULL
  AND r."type" = ${RewardType.Material}
  AND q."isActive" = ${true}
  ORDER BY q.id ASC`;

  if (quests.length === 0) return data;

  const ids = quests.map((quest) => quest.id);
  const records: any[] = await prisma.$queryRaw`
  SELECT "questId", COUNT(*) AS finished
  FROM "UserQuest" uq
  WHERE "questId" IN (${Prisma.join(ids)})
  AND "status" = ${QuestStatus.Finished}
  GROUP BY "questId"`;

  for (let i = 0; i < quests.length; i++) {
    const quest = quests[i];
    const quantity = quest.quantity;
    const record = records.find((r) => r.questId === quest.id);

    data.push({
      questId: quest?.id,
      questName: quest?.name,
      materialId: quest?.materialId,
      materialName: quest?.materialName || '',
      finished: record?.finished,
      quantity: quantity,
      total: quantity * (record?.finished || 0),
    });
  }

  return data;
}
