public class Review {

	private String reviewerID;
	private String reviewerName;
	private int	reviewerRating;
	private String reviewerDesc;

	public Review(String reviewID, String reviewerName, int reviewerRating, String reviewerDesc){
		this.reviewerID = reviewID;
		this.reviewerName = reviewerName;
		this.reviewerRating = reviewerRating;
		this.reviewerDesc = reviewerDesc;
	}

	public String getReviewerID() {
		return reviewerID;
	}

	public void setReviewerID(String reviewerID) {
		this.reviewerID = reviewerID;
	}

	public String getReviewerName() {
		return reviewerName;
	}

	public void setReviewerName(String reviewerName) {
		this.reviewerName = reviewerName;
	}

	public int getReviewerRating() {
		return reviewerRating;
	}

	public void setReviewerRating(int reviewerRating) {
		this.reviewerRating = reviewerRating;
	}

	public String getReviewerDesc() {
		return reviewerDesc;
	}

	public void setReviewerDesc(String reviewerDesc) {
		this.reviewerDesc = reviewerDesc;
	}
}
