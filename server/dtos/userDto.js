class UserDto {
  email;
  id;
  name;
  description;
  Avatar;
  sellerAverageRating;
  sellerReviewCount;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.name = model.name;
    this.description = model.description;
    this.Avatar = model.Avatar;
    this.sellerAverageRating = model.sellerAverageRating;
    this.sellerReviewCount = model.sellerReviewCount;
  }
}

export { UserDto };