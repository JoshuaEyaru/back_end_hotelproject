//import express from "express";
import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId

let hotels;

export default class HotelsDAO {
    static async injectDB(conn) {
        if (hotels) {
            return;
        }
        try {
            hotels = await conn.db(process.env.HOTELREVIEWS_NS).collection('hotels');
        }
        catch(e) {
            console.error(`Unable to connect in HOTELSDAO: ${e}`);
        }
    }

    static async getHotels({
        filters = null,
        page = 0,
        hotelsPerPage = 20, 
      } = {}) {// empty object is default parameter in case arg is undefined
      let query;
      if(filters) {
        if ("hotel_name" in filters) {
            query = { $text: { $search: filters['hotel_name']}};
        } else if ("rated" in filters) {
            query = { "rated": { $eq: filters['rated']}}
        }
      }
        

        let cursor;
        try {
            cursor = await hotels.find(query).limit(hotelsPerPage).skip(hotelsPerPage * page);
            const hotelsList = await cursor.toArray();
            const totalNumHotels = await hotels.countDocuments(query);
            return {hotelsList, totalNumHotels};
        }   catch(e) {
            console.error(`Unable to issue find command, $(e)`);
            return { hotelsList: [], totalNumHotels: 0 };
        }
      
    }

    static async getRatings() {
        let ratings = [];
        try {
            ratings = await hotels.distinct("rated");
            return ratings;
        }   catch(e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getHotelById(id) {

        try {
            return await hotels.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup: {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'hotel_id',
                        as: 'reviews',
                    }
                }
            ]).next();
        }   catch(e) {
            console.error(`Something went wrong in getHotelsById: ${e}`);
            throw e;
        }
    }

    // for favorites
    static async getHotelsByIdList(idList){
        let objIDList = idList.map(idVal => new ObjectId(idVal));
        let cursor;
        try {
            cursor = await hotels.find({
                _id: {
                    $in: objIDList
                }
            });
            const hotelsList = await cursor.toArray();
            return hotelsList;
        } catch(e) {
            console.error(`Something went wrong in getHotelsByIdList: ${e}`);
            throw e;
        }
    }
}