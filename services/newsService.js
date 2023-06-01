import News from "../models/newsModel.js"

export const getNews = async (language) => {
  const news = await News.find({});
  let mappepNews = [];

  switch (language) {
    case 'az':
      mappepNews = news.map(news => ({
        ...news.toObject(),
        title: news.titleAz,
        description: news.descriptionAz
      }));
      break;
    case 'ge':
        mappepNews = news.map(news => ({
        ...news.toObject(),
        title: news.titleGe,
        description: news.descriptionGe
      }));
      break;
    default:
        mappepNews = news.map(news => ({
        ...news.toObject(),
        title: news.titleAz,
        description: news.descriptionAz
      }));
      break;
  }

  return mappepNews;
};

