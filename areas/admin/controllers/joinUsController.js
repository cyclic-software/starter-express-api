import JoinUs from "../../../models/joinUsModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

const getJoinUsPage = async (req, res) => {
  const joinUs = await JoinUs.find({})
  res.render('../areas/admin/views/joinUs/joinUs', {
   joinUs
  })
}

const getJoinUsDetail = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById({ _id: req.params.id });
    
    res.status(200).render('../areas/admin/views/joinUs/detail', {
      joinUs,
    });
    
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};


const createJoinUs = async (req, res) => {
  try {
    const uploadedFiles = [];

    if (req.files) {
      // Check if multiple files are uploaded
      if (req.files.files && Array.isArray(req.files.files)) {
        for (const file of req.files.files) {
          const filePath = `public/files/${file.name}`; // Dosyanın kaydedileceği yol
          await file.mv(filePath); // Dosyayı "public" klasörüne kaydet

          uploadedFiles.push({
            url: `/${file.name}`, // Erişim URL'si
            file_id: file.name // Dosya adı olarak public_id'yi kullanabilirsiniz
          });
        }
      } else if (req.files.file) {
        // Single file is uploaded
        const file = req.files.file;
        const filePath = `public/files/${file.name}`; // Dosyanın kaydedileceği yol
        await file.mv(filePath); // Dosyayı "public" klasörüne kaydet

        uploadedFiles.push({
          url: `/${file.name}`, // Erişim URL'si
          file_id: file.name // Dosya adı olarak public_id'yi kullanabilirsiniz
        });
      }
    }

    // Create the news entry with the uploaded files
    const joinUs = new JoinUs({
      descriptionAz: req.body.descriptionAz,
      descriptionGe: req.body.descriptionGe,

      files: uploadedFiles
    });

    // Save the news entry to the database
    await joinUs.save();

    res.status(201).redirect("/admin/joinUs");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error
    });
  }
};






const getUpdateJoinUs = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById({ _id: req.params.id });
    
    res.status(200).render('../areas/admin/views/joinUs/update', {
     joinUs
    })
  } catch (error) {
    res.status(500).json({
      succeded: false,
      error
    })
  }
}


const updateJoinUs = async (req, res) => {
  try {
    const joinUs = await JoinUs.findById(req.params.id);

    if (req.files && req.files.files) {
      // Birden fazla dosya yüklendiğinde
      // Önce mevcut tüm dosyaları sil
      for (const file of joinUs.files) {
        const filePath = path.join("public/files", file.file_id);
        fs.unlinkSync(filePath);
      }

      // Yeni dosyaları kaydet
      const uploadedFiles = [];
      for (const file of req.files.files) {
        const filePath = path.join("public/files", file.name);
        await file.mv(filePath);
        uploadedFiles.push({
          url: `/${file.name}`,
          file_id: file.name,
        });
      }

      // Eski dosyaları güncelle
      joinUs.files = uploadedFiles;
    } else if (req.files && req.files.file) {
      // Tek dosya yüklendiğinde
      if (joinUs.files.length > 0) {
        // Mevcut dosyayı sil
        const filePath = path.join("public/files", joinUs.files[0].file_id);
        fs.unlinkSync(filePath);
      }

      // Yeni dosyayı kaydet
      const file = req.files.file;
      const filePath = path.join("public/files", file.name);
      await file.mv(filePath);

      // Güncellenmiş dosyayı ekle
      joinUs.files = [
        {
          url: `/${file.name}`,
          file_id: file.name,
        },
      ];
    } else {
      // Eğer dosya yüklenmediyse veya dosyalar boşsa, files'i boş bir dizi olarak ayarla
      joinUs.files = [];
    }

    // Diğer alanları güncelle
    joinUs.descriptionAz = req.body.descriptionAz;
    joinUs.descriptionGe = req.body.descriptionGe;

    // Kaydet
    await joinUs.save();

    res.redirect("/admin/joinUs");
  } catch (error) {
    res.status(500).json({
      succeeded: false,
      error,
    });
  }
};

export { updateJoinUs ,getUpdateJoinUs,createJoinUs,getJoinUsDetail,getJoinUsPage};