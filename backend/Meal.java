public class Meal {

	private String mealID;
	private String name;
	private float total_calories;
	private float total_protein;
	private float total_fat;
	private float total_carb;
	String recipe;
	public Meal(String mealID, String name, float total_calories, float total_protein, float total_fat, float total_carb, String recipe){
		this.mealID = mealID;
		this.name = name;
		this.total_calories = total_calories;
		this.total_protein = total_protein;
		this.total_fat = total_fat;
		this.total_carb = total_carb;
		this.recipe = recipe;
	}

	public String getMealID() {
		return mealID;
	}

	public void setMealID(String mealID) {
		this.mealID = mealID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getTotal_calories() {
		return total_calories;
	}

	public void setTotal_calories(float total_calories) {
		this.total_calories = total_calories;
	}

	public float getTotal_carb() {
		return total_carb;
	}

	public void setTotal_carb(float total_carb) {
		this.total_carb = total_carb;
	}

	public float getTotal_protein() {
		return total_protein;
	}

	public void setTotal_protein(float total_protein) {
		this.total_protein = total_protein;
	}

	public float getTotal_fat() {
		return total_fat;
	}

	public void setTotal_fat(float total_fat) {
		this.total_fat = total_fat;
	}

	public String getRecipe() {
		return recipe;
	}

	public void setRecipe(String recipe) {
		this.recipe = recipe;
	}
}
