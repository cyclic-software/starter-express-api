<<<<<<< HEAD
const express = require('express');
const http = require('http'); // Tambahkan ini
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Inisialisasi http.Server untuk Socket.IO
const server = http.createServer(app); // Gunakan http.Server untuk membuat server

// IO SOCKET
const io = require('socket.io')(server); // Gunakan server, bukan app

// import
const { ExpressError } = require('./utils/ExpressError');
// try catch async
const catchAsync = require('./utils/catchAsync');
global.catchAsync = catchAsync.asyncWrapper;
// import models
const { User } = require('./models/userSchema');
// routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Perbaiki typo di sini
const customerRoutes = require('./routes/customerRoutes');
const kasirRoutes = require('./routes/kasirRoutes');

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, '/uploads')));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

mongoose.connect('mongodb+srv://azziz167:hpF6XorqXppVX2F4@cluster0.aevbadv.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Mongo Connection Open');
    })
    .catch(err => {
        console.log('Mongo Connection Error');
        console.log(err);
    });

const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
app.use('/admin', adminRoutes); // Perbaiki typo di sini
app.use('/customer', customerRoutes);
app.use('/kasir', kasirRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});
const StrukPesanan = require('./models/strukPesananSchema');
const StrukProduk = require('./models/strukProdukSchema');
// Debugging untuk Socket.IO
io.on('connection', (socket) => {
    console.log('A client connected: ' + socket.id);

    socket.on('disconnect', () => {
        console.log('A client disconnected: ' + socket.id);
    });

    socket.on('updateReqTglPesan', async (data) => {
        try {
            const strukPesanan = await StrukPesanan.findOne();
    
            // Jika strukPesanan ada, lakukan update data sesuai dengan data yang diterima
            if (strukPesanan) {
                strukPesanan.reqTglPesan = data.reqTglPesan;
                await strukPesanan.save();
                console.log('Updated request tanggal pesan:', strukPesanan);
            } else {
                // Jika strukPesanan tidak ada, buat dokumen baru
                const newStrukPesanan = new StrukPesanan({ reqTglPesan: data.reqTglPesan });
                await newStrukPesanan.save();
            }
            io.to('customerRoom').emit('updateReqTglPesan', { reqTglPesan: data.reqTglPesan });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }   
    });
    
    socket.on('updateSubTotal', async (data) => {

        try {
            // await StrukPesanan.findOneAndUpdate({}, { subtotal: data.subtotal }, { upsert: true });
            const strukPesanan = await StrukPesanan.findOne();

            // Jika strukPesanan ada, lakukan update data sesuai dengan data yang diterima
            if (strukPesanan) {
                console.log(data.subTotal);
                strukPesanan.subtotal = data.subTotal;
                strukPesanan.totalBayar = data.total;
                await strukPesanan.save();
            } else {
                console.log("masuk else");
                console.log(data.subTotal);
                console.log(data.total);
                const newStrukPesanan = new StrukPesanan({ subtotal: data.subtotal, totalBayar: data.total });
                // await newStrukPesanan.save();
            }
            io.to('customerRoom').emit('updateSubTotal', { subtotal: data.subtotal });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    }
    );

    socket.on('updateStrukPesanan', async (data) => {

        try {
            // await StrukPesanan.findOneAndUpdate({}, { total: data.total }, { upsert: true });
        const strukPesanan = await StrukPesanan.findOne();

        // Jika strukPesanan ada, lakukan update data sesuai dengan data yang diterima
        if (strukPesanan) {
            strukPesanan.totalBayar = data.total;
            await strukPesanan.save();
        } else {
            console.log("sasa"+data.total)
            console.log("masuk else" + data.subTotal);
            const newStrukPesanan = new StrukPesanan({ totalBayar: data.total, subtotal: data.subTotal });
            await newStrukPesanan.save();
        }
            io.to('customerRoom').emit('updateStrukPesanan', { total: data.total });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });
    
    socket.on('updateDiskon', async (data) => {

        try {
            // await StrukPesanan.findOneAndUpdate({}, { total: data.total }, { upsert: true });
        const strukPesanan = await StrukPesanan.findOne();

        // Jika strukPesanan ada, lakukan update data sesuai dengan data yang diterima
        if (strukPesanan) {
            strukPesanan.diskon = data.diskon;
            await strukPesanan.save();
        } else {
            // Jika strukPesanan tidak ada, buat dokumen baru
            const newStrukPesanan = new StrukPesanan({ diskon: data.diskon });
            await newStrukPesanan.save();
        }
            io.to('customerRoom').emit('updateDiskon', { diskon: data.diskon });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });

    socket.on('updateAlamat', async (data) => {

        try {
            // await StrukPesanan.findOneAndUpdate({}, { total: data.total }, { upsert: true });
        const strukPesanan = await StrukPesanan.findOne();

        // Jika strukPesanan ada, lakukan update data sesuai dengan data yang diterima
        if (strukPesanan) {
            strukPesanan.alamatPengiriman = data.alamat;
            await strukPesanan.save();
        } else {
            // Jika strukPesanan tidak ada, buat dokumen baru
            const newStrukPesanan = new StrukPesanan({ alamatPengiriman: data.alamat });
            await newStrukPesanan.save();
        }
            io.to('customerRoom').emit('updateAlamat', { alamat: data.alamat });
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });

    socket.on("addProductToCart", async (data) => {

        try {
            // Menggunakan findOne untuk mencari dokumen tunggal
            const strukProduk = await StrukProduk.findOne({ _id: data.itemId });
            
            if (strukProduk) {
                const jumlah = strukProduk.jumlah + 1;
                strukProduk.jumlah = jumlah;
                console.log('Jumlah produk:', jumlah);
                await strukProduk.save();
                console.log('Updated product:', strukProduk);
            } else {
                // Jika strukPesanan tidak ada, buat dokumen baru
                const newStrukProduk = new StrukProduk({
                    _id: data.itemId,
                    name: data.productName,
                    jumlah: 1,
                    harga: data.productPrice
                });
                await newStrukProduk.save();
                console.log('StrukProduk ditambahkan');
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error);
        }
    });

    socket.on("increaseJumlah", async (data) => {

        const strukProduk = await StrukProduk.findOne({ _id: data.itemId });
        if (strukProduk) {
            strukProduk.jumlah += 1;
            await strukProduk.save();
            console.log('Updated product:', strukProduk.jumlah);
        }
    });

    socket.on("decreaseJumlah", async (data) => {

        const strukProduk = await StrukProduk.findOne({ _id: data.itemId });
        if (strukProduk) {
            strukProduk.jumlah -= 1;
            await strukProduk.save();
            console.log('Updated product:', strukProduk.jumlah);
            if (strukProduk.jumlah == 0) {
                await strukProduk.deleteOne(); // Menggunakan await untuk menunggu penghapusan selesai
            }
        }
    });

    socket.on("removeFromCurrentOrder", async (data) => {
        console.log('Received product:', data);
        const strukProduk = await StrukProduk.findOne({ _id: data.itemId });
        if (strukProduk) {
            await strukProduk.deleteOne(); // Menggunakan await untuk menunggu penghapusan selesai
        }
    });

     // Menangani pesan untuk mengosongkan database
    socket.on("kosongkanDatabase", async () => {
        try {
                // Hapus semua data pada koleksi StrukPesanan
        await StrukPesanan.deleteMany({});
        // Hapus semua data pada koleksi StrukProduk
        await StrukProduk.deleteMany({});

        console.log("Database berhasil dikosongkan.");
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
    }
});
    
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
=======
const express = require('express')
const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send('Yaaao!')
})
app.listen(process.env.PORT || 3000)
>>>>>>> d80164897046dd1ad594a97421baa6eb72f930c2
