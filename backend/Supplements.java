public class Supplements {

	private String supplementID;
	private String name;
	private float quantity;
	public Supplements(String supplementID, String name, float quantity){
		this.supplementID = supplementID;
		this.name = name;
		this.quantity = quantity;
	}

	public String getSupplementID() {
		return supplementID;
	}

	public void setSupplementID(String supplementID) {
		this.supplementID = supplementID;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public float getQuantity() {
		return quantity;
	}

	public void setQuantity(float quantity) {
		this.quantity = quantity;
	}
}
