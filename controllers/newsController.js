import News from "../models/newsModel.js";
import CategoryNews from "../models/newsCatModel.js";
import * as newsService from "../services/newsService.js";

const createNews =async (req,res)=>{
  try {
    const news =await News.create(req.body);

    res.status(201).redirect("/users/dashboard")
  } catch (error) {
    res.status(500).json({
        succeded:false,
        error
    })
  }
};


// const filterNewsByCategory = async (req, res) => {
//   try {
//     const category = req.query.category;
//     console.log(category)
//     const query = {
//       categoryId: category
//     };

//     const news = await News.find(query);
//     console.log(news)

//     res.status(200).json({
//       success: true,
//       news: news
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

const getAllNews = async (req, res) => {
  try {
    const searchTerm = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const skipCount = (page - 1) * limit;

    const category = req.query.category;

    const query = {
      $or: [
        { titleAz: { $regex: searchTerm, $options: 'i' } },
        { descriptionAz: { $regex: searchTerm, $options: 'i' } }
      ]
    };

    if (category) {
      query.categoryId = category;
    }

    const totalNewsCount = await News.countDocuments(query);
    const totalPages = Math.ceil(totalNewsCount / limit);

    const language = req.cookies.language || 'az';

    const news = await News.find(query)
      .populate('categoryId', 'catNameAz catNameGe')
      .skip(skipCount)
      .limit(limit)
      .exec();

      let mappedNews = [];
      switch (language) {
        case 'az':
          mappedNews = news.map((newsItem) => {
            const formattedDate = newsItem.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
            return {
              ...newsItem.toObject(),
              title: newsItem.titleAz,
              description: newsItem.descriptionAz,
              formattedDate, // formattedDate özelliğini ekleyin
            };
          });
          break;
        case 'ge':
          mappedNews = news.map((newsItem) => {
            const formattedDate = newsItem.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
            return {
              ...newsItem.toObject(),
              title: newsItem.titleGe,
              description: newsItem.descriptionGe,
              formattedDate, // formattedDate özelliğini ekleyin
            };
          });
          break;
        default:
          mappedNews = news.map((newsItem) => {
            const formattedDate = newsItem.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
            return {
              ...newsItem.toObject(),
              title: newsItem.titleAz,
              description: newsItem.descriptionAz,
              formattedDate, // formattedDate özelliğini ekleyin
            };
          });
          break;
      }

    const cats = await CategoryNews.find({});
    let mappedCats = [];
    switch (language) {
      case 'az':
        mappedCats = cats.map(cats => ({
          ...cats.toObject(),
          catName: cats.catNameAz,
        }));
        break;
      case 'ge':
        mappedCats = cats.map(cats => ({
          ...cats.toObject(),
          catName: cats.catNameGe,
        }));
        break;
      default:
        mappedCats = cats.map(cats => ({
          ...cats.toObject(),
          catName: cats.catNameAz,
        }));
        break;
    }

    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.set('search', searchTerm);
    if (category) queryParams.set('category', category);

    const paginationUrls = [];
    for (let i = 1; i <= totalPages; i++) {
      queryParams.set('page', i.toString());
      paginationUrls.push(`/news?${queryParams.toString()}`);
    }   



    res.status(200).render('news', {
      
      cats: mappedCats,
      news: mappedNews,
      link: "news",
      totalPages,
      searchTerm,
      category,
      currentPage: page,
      paginationUrls
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error
    });
  }
};

const getNewsDetail = async (req, res) => {
  try {

    const language = req.cookies.language || 'az';
    const newsId = req.params.id;
    const news_ = await News.findById(newsId);
    let latestNews = await News.find({}).sort({ createdAt: -1 }).limit(8);

    // Mevcut haberi son 5 haberden çıkar
    latestNews = latestNews.filter(news => news._id.toString() !== newsId);

    let mappedNews = [];
    switch (language) {
      case 'az':
        mappedNews = latestNews.map(news => ({
          
          ...news.toObject(),
          title: news.titleAz,
          description: news.descriptionAz
        }));
        break;
      case 'ge':
        mappedNews = latestNews.map(news => ({
          ...news.toObject(),
          title: news.titleGe,
          description: news.descriptionGe
        }));
        break;
      default:
        mappedNews = latestNews.map(news => ({
          ...news.toObject(),
          title: news.titleAz,
          description: news.descriptionAz
        }));
        break;
    }

    let mappedNew;
switch (language) {
  case 'az':
    mappedNew={
      ...news_._doc,
      title : news_.titleAz,
      description : news_.descriptionAz
    }
    
    break;
  case 'ge':
    mappedNew={
      ...news_._doc,
      title : news_.titleGe,
      description : news_.descriptionGe
    }
    break;
  default:
    mappedNew={
      ...news_._doc,
      title : news_.titleAz,
      description : news_.descriptionAz
    }
    break;
}


    res.status(200).render('newsDetail', {
      news_:mappedNew,
      latestNews: mappedNews,
      link: "news"
    });
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error
    });
  }
};

export {createNews,getAllNews,getNewsDetail} ;
