import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(process.env.HOTELREVIEWS_NS).collection('reviews');
        } catch(e) {
            console.error(`Unable to establish connection handle in reviewsDA: ${e}`);
        }
    }

    static async addReview(hotelId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                hotel_id: ObjectId(hotelId)
            }
            return await reviews.insertOne(reviewDoc);
        } 
        catch(e) {
            console.error(`Unable to post review: ${e}`)
            return { error: e};
        }
    }

    static async updateReview(reviewId, userId, review, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: ObjectId(reviewId) },
                { $set: { review: review, date: date }}
            )
            return updateResponse
        }
        catch(e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e};
        }
    }

    static async deleteReview(reviewId, userId){
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            });
            return deleteResponse
        } catch(e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e}
        }
    }

}
