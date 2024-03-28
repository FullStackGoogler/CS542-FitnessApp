public class Recipe {

	private String recipeID;
	private String steps;
	public Recipe(String recipeID, String steps){
		this.recipeID = recipeID;
		this.steps = steps;
	}

	public String getRecipeID() {
		return recipeID;
	}

	public void setRecipeID(String recipeID) {
		this.recipeID = recipeID;
	}

	public String getSteps() {
		return steps;
	}

	public void setSteps(String steps) {
		this.steps = steps;
	}
}
