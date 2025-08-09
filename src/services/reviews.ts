import reviewsData from '../data/reviews.json';

export interface Review {
    id: string;
    guideId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    date: string;
    photos: string[];
    verified: boolean;
}

export const reviews: Review[] = reviewsData as Review[];

export const getReviewsByGuideId = (guideId: string): Review[] => {
    return reviews.filter(review => review.guideId === guideId);
};

export const getAverageRating = (guideId: string): number => {
    const guideReviews = getReviewsByGuideId(guideId);
    if (guideReviews.length === 0) return 0;
    
    const totalRating = guideReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / guideReviews.length) * 10) / 10;
};
