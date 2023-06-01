import News from "../../../models/newsModel.js";
import CategoryNews from "../../../models/newsCatModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


const getNewsPage = async (req, res) => {
  const newses = await News.find({})
    .populate('categoryId')
  const newsCats = await CategoryNews.find({})

  res.render('../areas/admin/views/news/news', {
    newses,
    newsCats
  })
}

// const getNewsCatPage = async (req, res) => {
//   const cats = await CategoryNews.find({})
//    console.log(cats);
//   res.render('../areas/admin/views/news/news', {
//     cats
//   })
// }

// const getRecentNews = async (limit) => {
//   try {
//     const recentNews = await News.find({})
//       .sort({ date: -1 }) // Tarihe göre sıralama (son eklenen en üstte olacak şekilde)
//       .limit(limit); // Belirli bir sayıda haber almak için

//     return recentNews;
//   } catch (error) {
//     throw error;
//   }
// };

const getNewsDetail = async (req, res) => {
  try {
    const news_ = await News.findById({ _id: req.params.id });
    
    res.status(200).render('../areas/admin/views/news/detail', {
      news_,
    });
    
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

// const createNews = async (req, res) => {
//   const result = await cloudinary.uploader.upload(
//     req.files.image.tempFilePath,
//     {
//       unique_filename: true,
//       folder: 'damvev_de'
//     }
//   )
//   try {
//     await News.create({
//       title: req.body.title,
//       description: req.body.description,
//       categoryId: req.body.categoryId,
//       url: result.secure_url,
//       image_id: result.public_id,
//     });

//     fs.unlinkSync(req.files.image.tempFilePath);

//     res.status(201).redirect("/admin/news")
//   } catch (error) {
//     res.status(500).json({
//       succeded: false,
//       error
//     })
//   }
// };
const createNews = async (req, res) => {
  try {
    const uploadedImages = [];
    const imagePromises = [];

    if (req.files) {
      // Check if multiple images are uploaded
      if (req.files.images && Array.isArray(req.files.images)) {
        for (const file of req.files.images) {
          // Upload original image
          imagePromises.push(
            cloudinary.uploader.upload(file.tempFilePath, {
              unique_filename: true,
              folder: 'damvev_de'
            })
          );

        }
      } else if (req.files.image) {
        // Single image is uploaded
        const file = req.files.image;
        // Upload original image
        imagePromises.push(
          cloudinary.uploader.upload(file.tempFilePath, {
            unique_filename: true,
            folder: 'damvev_de'
          })
        );
      }

      // Wait for all image uploads to complete
      const imageResults = await Promise.all(imagePromises);

      // Collect the secure URLs and public IDs of the uploaded images
      for (const result of imageResults) {
        uploadedImages.push({
          url: result.secure_url,
          image_id: result.public_id
        });
      }
    }

    // Create the news entry with the uploaded images
    const news = new News({
      titleAz: req.body.titleAz,
      titleGe: req.body.titleGe,
      descriptionAz: req.body.descriptionAz,
      descriptionGe: req.body.descriptionGe,
      categoryId: req.body.categoryId,
      images: uploadedImages
    });

    // Save the news entry to the database
    await news.save();

    // Delete the temporary files
    if (req.files && req.files.images && Array.isArray(req.files.images)) {
      for (const file of req.files.images) {
        fs.unlinkSync(file.tempFilePath);
      }
    } else if (req.files && req.files.image) {
      fs.unlinkSync(req.files.image.tempFilePath);
    }

    res.status(201).redirect("/admin/news");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error
    });
  }
};


const createNewsCat = async (req, res) => {
  try {
    const catNews = await CategoryNews.create(req.body);

    res.status(201).redirect("/admin/news")
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error
    })
  }
};

const deleteNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    // Tüm fotoğrafları sil
    for (const image of news.images) {
      const photoId = image.image_id;
      await cloudinary.uploader.destroy(photoId);
    }

    // Haberi sil
    await News.findByIdAndDelete(req.params.id);

    res.redirect("/admin/news");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error
    });
  }
};


const getUpdateNews = async (req, res) => {
  try {
    const news_ = await News.findById({ _id: req.params.id });
    const categories = await CategoryNews.find({});
    res.status(200).render('../areas/admin/views/news/update', {
      news_,
      categories
    })
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error
    })
  }
}


const updateNews = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);

    let uploadedImages = [];

    if (req.files && req.files.images) {
      // Birden fazla fotoğraf yüklendiğinde
      // Önce mevcut tüm fotoğrafları sil
      for (const image of news.images) {
        const photoId = image.image_id;
        await cloudinary.uploader.destroy(photoId);
      }

      // Yeni fotoğrafları yükle ve güncellenmiş URL ve public ID'leri topla
      const imagePromises = [];

      for (const file of req.files.images) {
        imagePromises.push(
          cloudinary.uploader.upload(file.tempFilePath, {
            unique_filename: true,
            folder: 'damvev_de'
          })
        );
      }

      const imageResults = await Promise.all(imagePromises);

      for (const result of imageResults) {
        uploadedImages.push({
          url: result.secure_url,
          image_id: result.public_id
        });
      }

      // Geçici dosyaları sil
      for (const file of req.files.images) {
        fs.unlinkSync(file.tempFilePath);
      }
    } else if (req.files && req.files.image) {
      // Tek fotoğraf yüklendiğinde
      if (news.images.length > 0) {
        // Mevcut fotoğrafı sil
        const photoId = news.images[0].image_id;
        await cloudinary.uploader.destroy(photoId);
      }

      // Yeni fotoğrafı yükle ve güncellenmiş URL ve public ID'yi topla
      const file = req.files.image;
      const result = await cloudinary.uploader.upload(file.tempFilePath, {
        unique_filename: true,
        folder: 'damvev_de'
      });

      // Güncellenmiş fotoğrafı ekle
      uploadedImages = [
        {
          url: result.secure_url,
          image_id: result.public_id
        }
      ];

      // Geçici dosyayı sil
      fs.unlinkSync(file.tempFilePath);
    } else {
      // Eğer resim yüklenmediyse veya resimler boşsa, uploadedImages'i boş bir dizi olarak ayarla
      uploadedImages = [];
    }

    // Haberin diğer alanlarını güncelle
    news.titleAz = req.body.titleAz;
    news.titleGe = req.body.titleGe;

    news.descriptionAz = req.body.descriptionAz;
    news.descriptionGe = req.body.descriptionGe;

    news.categoryId = req.body.categoryId;
    news.images = uploadedImages;

    // Haberi kaydet
    await news.save();

    res.redirect("/admin/news");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error
    });
  }
};


const getUpdateCat = async (req, res) => {
  try {
    const cat = await CategoryNews.findById({ _id: req.params.id });
    
    res.status(200).render('../areas/admin/views/news/updateCat', {
    cat
    })
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error
    })
  }
}


const updateCat = async (req, res) => {
  try {
    const cat = await CategoryNews.findById(req.params.id);
    cat.catNameAz = req.body.catNameAz;
    cat.catNameGe = req.body.catNameGe;
   
    await cat.save();
    res.redirect("/admin/news");
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};




export { getNewsPage, getNewsDetail, createNews, createNewsCat, deleteNews, getUpdateNews, updateNews,updateCat ,getUpdateCat};