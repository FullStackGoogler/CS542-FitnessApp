public class Nutrition_Plan {

	private String nutrition_plan_id;
	private float calorie_goal;
	private float protein_goal;
	private String diet_type;
	private float fat_goal;
	private float carb_goal;

	public Nutrition_Plan(String nutrition_plan_id, float calorie_goal, String diet_type, float protein_goal, float fat_goal, float carb_goal){
		this.nutrition_plan_id = nutrition_plan_id;
		this.calorie_goal = calorie_goal;
		this.diet_type = diet_type;
		this.protein_goal = protein_goal;
		this.fat_goal = fat_goal;
		this.carb_goal = carb_goal;
	}
}
