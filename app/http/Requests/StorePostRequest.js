const FormRequest = require('./FormRequest');

class StorePostRequest extends FormRequest {
    validate() {
        const params = {
            type: parseInt(this.req.body.type),
            title: this.req.body.title,
            description: this.req.body.description,
            thumbnail: this.req.files && this.req.files.thumbnail ? this.req.files.thumbnail : null,
        };

        this.required('type', this.req.body.type);
        this.integer('type', this.req.body.type);
        this.required('title', params.title);
        this.required('description', params.description);
        this.failIfInvalid();

        return params;
    }
}

module.exports = StorePostRequest;
