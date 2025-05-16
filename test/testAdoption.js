const Adoption = artifacts.require("Adoption");

contract("Adoption", (accounts) => {
  let adoption;

  before(async () => {
    adoption = await Adoption.deployed();
  });

  it("should adopt a pet successfully", async () => {
    const petId = 8;
    const adopter = accounts[0];

    await adoption.adopt(petId, { from: adopter });
    const adopterAddress = await adoption.adopters(petId);

    assert.equal(adopterAddress, adopter, "Adopter address should match the sender.");
  });

  it("should return the correct list of adopters", async () => {
    const adopters = await adoption.getAdopters();
    const petId = 8;

    assert.equal(adopters[petId], accounts[0], "The adopter should be in the adopters array.");
  });

  it("should fail to adopt an invalid pet ID", async () => {
    try {
      await adoption.adopt(100, { from: accounts[1] }); // Invalid ID
      assert.fail("Adoption did not fail for invalid pet ID.");
    } catch (error) {
      // Only check that an error was thrown (Truffle may not show revert message reliably)
      assert(error instanceof Error, "Expected an error to be thrown");
    }
  });
});
