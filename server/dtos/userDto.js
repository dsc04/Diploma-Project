class UserDto {
    email;
    id;
    name;
    description;
    Avatar;

    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.Avatar = model.Avatar;
    }
}

export { UserDto };