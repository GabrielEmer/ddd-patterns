import Address from "./address"

describe("Address unit tests", () => {

  it("should create address", () => {
    const address = new Address("Street 1", 123, "12345-678", "City")
    expect(address.toString()).toBe("Street 1, 123, 12345-678, City")
  })

  it("should throw error when street is empty", () => {
    expect(() => {
      const address = new Address("", 123, "12345-678", "City")
    }).toThrow("Street is required")
  })

  it("should throw error when number is zero", () => {
    expect(() => {
      const address = new Address("Street 1", 0, "12345-678", "City")
    }).toThrow("Number is required")
  })

  it("should throw error when zip is empty", () => {
    expect(() => {
      const address = new Address("Street 1", 123, "", "City")
    }).toThrow("Zip is required")
  })

  it("should throw error when city is empty", () => {
    expect(() => {
      const address = new Address("Street 1", 123, "12345-678", "")
    }).toThrow("City is required")
  })
})