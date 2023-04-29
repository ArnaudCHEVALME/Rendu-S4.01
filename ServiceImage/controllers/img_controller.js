const Link = require('../models/img_model.js');
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const sharp = require('sharp');

// Create a new link
exports.create = async (req, res) => {
  try {
    const link = new Link({
      lien: req.body.lien,
    });

    const result = await Link.where({ lien: req.body.lien }).findOne();
    if (result == null) {
      console.log("n'existe pas !");

      const url = link.lien;
      const imageFilename = path.basename(url);
      const originalPath = path.join(__dirname, '..', 'images/original', imageFilename);
      const compressedPath = path.join(__dirname, '..', 'images/compressed', imageFilename);
      const thumbnailPath = path.join(__dirname, '..', 'images/thumbnails', imageFilename);

      // Télécharger l'image uniquement si elle n'a pas déjà été enregistrée sur le disque dur
      if (!fs.existsSync(originalPath)) {
        const response = await axios.get(url, { responseType: 'stream' });
        response.data.pipe(fs.createWriteStream(originalPath));
        await new Promise(resolve => {
          response.data.on('end', () => {
            resolve();
          });
        });
        console.log(`L'image originale a été téléchargée et enregistrée dans ${originalPath}`);

        // Réduire la taille de l'image et enregistrer la version compressée
        await sharp(originalPath)
        .png({ compressionLevel: 6 })
        .jpeg({ quality: 2 })
        .toFile(compressedPath, (err, info) => {
          if (err) {
            console.error(err);
          } else {
            console.log('Image compressée avec succès :', info);
          }
        });
        console.log(`L'image compressée a été enregistrée dans ${compressedPath}`);

        // Créer un thumbnail et enregistrer la version miniature
        await sharp(originalPath)
          .resize(200, 150)
          .toFile(thumbnailPath);
        console.log(`Le thumbnail a été créé et enregistré dans ${thumbnailPath}`);
      } else {
        console.log(`L'image ${imageFilename} existe déjà dans le dossier Téléchargements`);
      }

      fs.unlink(originalPath, (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`L'image originale a été supprimée : ${originalPath}`);
        }
      });
      res.status(200).send("Succès !");
      await link.save();
      // créer
    } else {
      console.log("existe déjà !");
      res.status(500).json({ error: 'existe déjà !' });
      // mettre à jour
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get all links
exports.getAll = async (req, res) => {
  try {
    const links = await Link.find();
    res.json(links);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get compressed picture by filename
exports.getPictureCompressed = async (req, res) => {
  try {
    const filename = req.params.name;
    console.log(filename);
    if (!filename) {
      return res.status(400).json({ error: 'Le nom du fichier est requis' });
    }

    const compressedPath = path.join(__dirname, '..', 'images/compressed', filename);
    if (!fs.existsSync(compressedPath)) {
      return res.status(404).json({ error: `L'image ${filename} n'existe pas` });
    }

    res.setHeader('Content-Type', 'image/jpeg');
    fs.createReadStream(compressedPath).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get compressed picture by filename
exports.getPictureThumbnails = async (req, res) => {
  try {
    const filename = req.params.name;
    console.log(filename);
    if (!filename) {
      return res.status(400).json({ error: 'Le nom du fichier est requis' });
    }

    const compressedPath = path.join(__dirname, '..', 'images/thumbnails', filename);
    if (!fs.existsSync(compressedPath)) {
      return res.status(404).json({ error: `L'image ${filename} n'existe pas` });
    }

    res.setHeader('Content-Type', 'image/jpeg');
    fs.createReadStream(compressedPath).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

exports.deleteAll = async (req, res) => {
  try {
    await Link.deleteMany();
    const compressedDir = path.join(__dirname, '..', 'images/compressed');
const thumbnailsDir = path.join(__dirname, '..', 'images/thumbnails');

fs.readdir(compressedDir, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach(file => {
      fs.unlink(path.join(compressedDir, file), err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Le fichier ${file} a été supprimé du dossier ${compressedDir}`);
        }
      });
    });
  }
});

fs.readdir(thumbnailsDir, (err, files) => {
  if (err) {
    console.error(err);
  } else {
    files.forEach(file => {
      fs.unlink(path.join(thumbnailsDir, file), err => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Le fichier ${file} a été supprimé du dossier ${thumbnailsDir}`);
        }
      });
    });
  }
});
    res.json({ message: 'Tous les liens ont été supprimés avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete link by name
exports.deleteByName = async (req, res) => {
  try {
    const filename = req.params.name;
    if (!filename) {
      return res.status(400).json({ error: 'Le nom du fichier est requis' });
    }

    const links = await Link.find();
    let found = false;

    for (let i = 0; i < links.length; i++) {
      if (links[i].lien.includes(filename)) {
        await Link.findByIdAndDelete(links[i]._id);
        console.log(`Le lien ${links[i].lien} a été supprimé`);
        found = true;
      }
    }

    if (!found) {
      console.log(`Aucun lien contenant ${filename} n'a été trouvé`);
    }


    //const originalPath = path.join(__dirname, '..', 'images/original/', filename);
    const compressedPath = path.join(__dirname, '..', 'images/compressed', filename);
    const thumbnailPath = path.join(__dirname, '..', 'images/thumbnails', filename);
    
    console.log(compressedPath, thumbnailPath);

    // if (fs.existsSync(originalPath)) {
    //   fs.unlinkSync(originalPath);
    //   console.log(`L'image originale a été supprimée : ${originalPath}`);
    // }

    if (fs.existsSync(compressedPath)) {
      fs.unlinkSync(compressedPath);
      console.log(`L'image compressée a été supprimée : ${compressedPath}`);
    }

    if (fs.existsSync(thumbnailPath)) {
      fs.unlinkSync(thumbnailPath);
      console.log(`Le thumbnail a été supprimé : ${thumbnailPath}`);
    }else{
      return res.status(404).json({ error: `L'image n'existe pas` });
    }

    await Link.deleteOne({ lien: filename });
    res.json({ message: `L'image ${filename} a été supprimé avec succès.` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


