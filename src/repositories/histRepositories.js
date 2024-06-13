const NotFoundError = require("../exceptions/NotFoundError");
const prisma = require("../utils/database");

async function addHistoryRepository({ userId, imageUrl, data }) {
  const diseasesData = Object.entries(data).map(([key, value]) => ({
    disease: key,
    percentage: Math.floor(value*100),
  }));

  diseasesData.sort((a, b) => b.percentage - a.percentage);
  const choosenData = diseasesData.slice(0, 3);

  const history = await prisma.histories.create({
    data: {
      image_url: imageUrl,
      user_id: userId,
      diseases: {
        create: choosenData,
      },
    },
    include: {
      diseases: true, 
    },
  });

  return history;
}

async function getHistoriesRepository(userId) {
  const histories = await prisma.histories.findMany({
    where: {
      user_id: userId
    },
    select: {
      history_id: true,
      user_id: true,
      image_url: true,
      disease: true,
      percentage: true,
    }
  });

  return histories;
}

async function getHistoryByIdRepository(id, userId) {
  const history = await prisma.histories.findUnique({
    where: {
      history_id: id,
      user_id: userId,
    },
    select: {
      history_id: true,
      user_id: true,
      image_url: true,
      disease: true,
      percentage: true,
    }
  });

  if (!history) {
    throw new NotFoundError('history not found');
  }

  return history;
}

module.exports = { addHistoryRepository, getHistoriesRepository, getHistoryByIdRepository }
