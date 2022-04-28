import Listing from "../models/Listing";

describe("Listing", () => {
  it("should create a listing", () => {
    const listing = new Listing({
      postal: "12345",
      district: 13,
      address: "123 Main St",
      property_type: "house",
      size: 1000,
      price: 100000,
      image:
        "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
      no_of_bedrooms: 2,
      no_of_bathrooms: 1,
      description: "This is a description",
    });

    expect(listing.postal).toBe("12345");
    expect(listing.district).toBe(13);
    expect(listing.address).toBe("123 Main St");
  });

  it("should create a listing with no image", () => {
    const listing = new Listing({
      postal: "12345",
      district: 13,
      property_type: "house",
      no_of_bedrooms: 2,
      no_of_bathrooms: 1,
      description: "This is a description",
    });

    expect(listing.postal).toBe("12345");
    expect(listing.district).toBe(13);
  });
});
