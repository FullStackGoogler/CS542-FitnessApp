public class Gym {
	private String gymID;
	private String name;
	private int rating;
	private String location;
	private String phoneNum;
	private String email;
	private float membership_pricing;

	public Gym(String gymID, String name, int rating, String location, String phoneNum, String email, float membership_pricing){
		this.gymID = gymID;
		this.name = name;
		this.rating = rating;
		this.location = location;
		this.phoneNum = phoneNum;
		this.email = email;
		this.membership_pricing = membership_pricing;
	}

	public String getGymID() {
		return gymID;
	}

	public void setGymID(String gymID) {
		this.gymID = gymID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getRating() {
		return rating;
	}

	public void setRating(int rating) {
		this.rating = rating;
	}

	public String getPhoneNum() {
		return phoneNum;
	}

	public void setPhoneNum(String phoneNum) {
		this.phoneNum = phoneNum;
	}

	public String getLocation(){
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public float getMembership_pricing() {
		return membership_pricing;
	}

	public void setMembership_pricing(float membership_pricing) {
		this.membership_pricing = membership_pricing;
	}
}

