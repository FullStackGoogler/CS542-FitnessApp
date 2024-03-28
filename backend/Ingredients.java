
public class Ingredients {

	private String ingredientID;
	private String name;
	private float calorie;
	private float fat;
	private float carb;
	private float protein;

	public Ingredients(String ingredientID, String name, float calorie, float fat, float carb, float protein){
		this.ingredientID = ingredientID;
		this.name = name;
		this.calorie = calorie;
		this.fat = fat;
		this.carb = carb;
		this.protein = protein;
	}

	public String getIngredientID() {
		return ingredientID;
	}

	public void setIngredientID(String ingredientID) {
		this.ingredientID = ingredientID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getCalorie() {
		return calorie;
	}

	public void setCalorie(float calorie) {
		this.calorie = calorie;
	}

	public float getFat() {
		return fat;
	}

	public void setFat(float fat) {
		this.fat = fat;
	}

	public float getCarb() {
		return carb;
	}

	public void setCarb(float carb) {
		this.carb = carb;
	}

	public float getProtein() {
		return protein;
	}

	public void setProtein(float protein) {
		this.protein = protein;
	}
}
