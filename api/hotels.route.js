import express from 'express';
import HotelsController from './hotels.controller.js';
import ReviewsController from './reviews.controller.js';
import FavoritesController from './favorites.controller.js';


const router = express.Router(); // get access to express router

router.route("/").get(HotelsController.apiGetHotels);
router.route("/id/:id").get(HotelsController.apiGetHotelById);
router.route("/ratings").get(HotelsController.apiGetRatings);

router.route("/review").post(ReviewsController.apiPostReview);

router.route("/review").put(ReviewsController.apiUpdateReview);
router.route("/review").delete(ReviewsController.apiDeleteReview);  

router.route("/favorites").put(FavoritesController.apiUpdateFavorites);
router.route("/favorites/:userId").get(FavoritesController.apiGetFavorites);
router.route("/idList/:idList").get(HotelsController.apiGetHotelsByIdList);





export default router;