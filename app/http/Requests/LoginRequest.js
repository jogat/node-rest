const FormRequest = require('./FormRequest');

class LoginRequest extends FormRequest {
    validate() {
        const { email, password, tenant_token, platform } = this.req.body;

        this.required('email', email);
        this.required('password', password);
        this.failIfInvalid();

        return { email, password, tenant_token, platform };
    }
}

module.exports = LoginRequest;
