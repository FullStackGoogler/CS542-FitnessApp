import java.sql.Date;

public class Daily_Meal_Plan {
	private String daily_meal_id;
	private Date date;
	private float total_calories;
	private float total_protein;
	private float total_carb;
	private float total_fat;

	public Daily_Meal_Plan(String daily_meal_id, Date date, float total_calories, float total_protein, float total_carb, float total_fat){
		this.daily_meal_id = daily_meal_id;
		this.date = date;
		this.total_calories = total_calories;
		this.total_protein = total_protein;
		this.total_carb = total_carb;
		this.total_fat = total_fat;
	}

	public String getDaily_meal_id() {
		return daily_meal_id;
	}

	public void setDaily_meal_id(String daily_meal_id) {
		this.daily_meal_id = daily_meal_id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public float getTotal_calories() {
		return total_calories;
	}

	public void setTotal_calories(float total_calories) {
		this.total_calories = total_calories;
	}

	public float getTotal_protein() {
		return total_protein;
	}

	public void setTotal_protein(float total_protein) {
		this.total_protein = total_protein;
	}

	public float getTotal_carb() {
		return total_carb;
	}

	public void setTotal_carb(float total_carb) {
		this.total_carb = total_carb;
	}

	public float getTotal_fat() {
		return total_fat;
	}

	public void setTotal_fat(float total_fat) {
		this.total_fat = total_fat;
	}
}
