// const { param } = require('../Routes/moviesRoutes');
// const Movie = require('./../Models/movieModel');
// const ApiFeatures = require('./../Utils/ApiFeatures');
// const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
// const CustomError = require('./../Utils/CustomError');

// // exports.getHighestRated = (req, res, next) => {
// //     req.query.limit = '5';
// //     req.query.sort = '-ratings';

// //     next();
// // }

// exports.getAllMovies = asyncErrorHandler(async (req, res, next) => {

//     // const features = new ApiFeatures(Movie.find(), req.query)
//     //                         .filter()
//     //                         .sort()
//     //                         .limitFields()
//     //                         .paginate();
//     // let movies = await features.query;

//     res.status(200).json({
//         status: 'success',
//         length: movies.length,
//         data: {
//             movies
//         }
//     });
    
// })

// // exports.getMovie = asyncErrorHandler(async (req, res, next) => {
 
// //     //const movie = await Movie.findOne({_id: req.params.id});
// //     const movie = await Movie.findById(req.params.id);


// //     if(!movie){
// //         const error = new CustomError('Movie with that ID is not found!', 404);
// //         return next(error);
// //     }

// //     res.status(200).json({
// //         status: 'success',
// //         data: {
// //             movie
// //         }
// //     });
// // })



// exports.createMovie =asyncErrorHandler(async (req, res, next) => {

//     const movie = await Movie.create(req.body);

//     res.status(201).json({
//         status: 'success',
//         data: {
//             movie
//         }
//     })
// });

// exports.updateMovie = async (req, res, next) => {
//     try{
//         const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});

//         if(!updatedMovie){
//             const error = new CustomError('Movie with that ID is not found!', 404);
//             return next(error);
//         }

//         res.status(200).json({
//             status: "success",
//             data: {
//                 movie: updatedMovie
//             }
//         });
//     }catch(err){
//         res.status(404).json({
//             status:"fail",
//             message: err.message
//         });
//     }
// }

// exports.deleteMovie = asyncErrorHandler(async (req, res, next) => {

//     const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

//     if(!deletedMovie){
//         const error = new CustomError('Movie with that ID is not found!', 404);
//         return next(error);
//     }

//     res.status(204).json({
//         status: 'success',
//         data: null
//     });
// })

// // exports.getMovieStats = asyncErrorHandler(async (req, res, next) => {
// //         const stats = await Movie.aggregate([
// //             { $match: {ratings: {$gte: 4.5}}},
// //             { $group: {
// //                 _id: '$releaseYear',
// //                 avgRating: { $avg: '$ratings'},
// //                 avgPrice: { $avg: '$price' },
// //                 minPrice: { $min: '$price' },
// //                 maxPrice: { $max: '$price' },
// //                 priceTotal: { $sum: '$price'},
// //                 movieCount: { $sum: 1}
// //             }},
// //             { $sort: { minPrice: 1}}
// //             //{ $match: {maxPrice: {$gte: 60}}}
// //         ]);

// //         res.status(200).json({
// //             status: 'success',
// //             count: stats.length,
// //             data: {
// //                 stats
// //             }
// //         });
// // })

// // exports.getMovieByGenre = asyncErrorHandler(async (req, res, next) => {
// //         const genre = req.params.genre;
// //         const movies = await Movie.aggregate([
// //             {$unwind: '$genres'},
// //             {$group: {
// //                 _id: '$genres',
// //                 movieCount: { $sum: 1},
// //                 movies: {$push: '$name'}, 
// //             }},
// //             {$addFields: {genre: "$_id"}},
// //             {$project: {_id: 0}},
// //             {$sort: {movieCount: -1}},
// //             //{$limit: 6}
// //             //{$match: {genre: genre}}
// //         ]);

// //         res.status(200).json({
// //             status: 'success',
// //             count: movies.length,
// //             data: {
// //                 movies
// //             }
// //         });
// // })

const fs=require('fs');
const moviesdata = JSON.parse(fs.readFileSync('./data/movies.json', 'utf-8'));
exports.getAllMovies = (req, res) => {
    res.status(200).json({
        status: "success",
        count: moviesdata.length,
        data: {
            movies: moviesdata
        }
    });
}
exports.createMovie = (req, res) => {
    const newid = moviesdata[moviesdata.length - 1].id + 1;
    const newmovie = Object.assign({ id: newid }, req.body);
    moviesdata.push(newmovie);
    fs.writeFile('./data/moviesdata.json', JSON.stringify(moviesdata), (err) => {
        res.status(201).json({
            status: "success",
            data: {
                movie: newmovie
            }
        })
    })

}
 exports.getMovie = (req, res) => {
    const paramid = req.params.id * 1;
    let movieparams = moviesdata.find(ele => ele.id === paramid);
    if (!movieparams) {
        return res.status(404).json({
            status: "Fail",
            message: 'movie with ID ' + paramid + ' is not Found'
        })
    }
    res.status(200).json({
        status: "success",
        data: {
            movieparams: movieparams
        }
    })
    console.log(req.params);
}
//update movie
exports.updateMovie = async (req, res, next) => {
        try{
            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
    
            if(!updatedMovie){
                const error = new CustomError('Movie with that ID is not found!', 404);
                return next(error);
            }
    
            res.status(200).json({
                status: "success",
                data: {
                    movie: updatedMovie
                }
            });
        }catch(err){
            res.status(404).json({
                status:"fail",
                message: err.message
            });
        }
    }
//delete method
exports.deleteMovie = (req, res) => {
    const deleteid = req.params.id + 1;
    const moviedelete = moviesdata.find((ele) => ele.deleteid === id);
    if (!moviedelete) {
        return res.status(404).json({
            status: "fail",
            message: 'No movie object with ID ' + deleteid + ' is found '
        })
    }
    const movieindex = moviesdata.indexOf(moviedelete);
    moviesdata.slice(movieindex, 1);
    fs.writeFile('./data/movies.json', JSON.stringify(moviesdata), (err) => {
        res.status(204).json({
            status: 'success',
            data: {
                movie: null
            }
        })
    })
}       
