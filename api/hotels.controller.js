import HotelsDAO from "../dao/hotelsDAO.js";

export default class HotelsController {
    static async apiGetHotels(req, res, next) {
        const hotelsPerPage = req.query.hotelsPerPage ? parseInt(req.query.hotelsPerPage) : 4;
        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}
        if (req.query.rated) {
            filters.rated = req.query.rated;
        } else if (req.query.title) {
            filters.hotel_name = req.query.hotel_name;
        }

        const { hotelsList, totalNumHotels } = await HotelsDAO.getHotels({ filters, page, hotelsPerPage });

        let response = {
            hotels: hotelsList,
            page: page,
            filters: filters,
            entries_per_page: hotelsPerPage,
            total_results: totalNumHotels,
        };
        res.json(response);
    }

    static async apiGetHotelById(req, res, next) {
        try {
            let id = req.params.id || {}
            let hotel = await HotelsDAO.getHotelById(id);
            if (!hotel) {
                res.status(404).json({ error: "not found"});
                return;
            }
            res.json(hotel);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e});
        }
    }

    static async apiGetHotelsByIdList(req, res, next){
        try {
            let idList = JSON.parse(req.params.idList) || {}
            let hotels = await HotelsDAO.getHotelsByIdList(idList);
            if (!hotels) {
                res.status(404).json({error: "not found"});
                return;
            }
            res.json(hotels);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({error: e });
        }
    }

    static async apiGetRatings(req, res, next) {
        try {
            let propertyTypes = await HotelsDAO.getRatings();
            res.json(propertyTypes);
        } catch(e) {
            console.log(`API, ${e}`);
            res.status(500).json({ error: e } );
        }
    }
}