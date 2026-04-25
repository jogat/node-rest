const {request, response} = require('express');
const StorePostRequest = require('../Requests/StorePostRequest');
const PostService = require('../../Services/PostService');

class PostController {

    constructor(postService = new PostService()) {
        this.postService = postService;
        this.userFeed = this.userFeed.bind(this);
        this.show = this.show.bind(this);
        this.add = this.add.bind(this);
    }

    async userFeed (req = request, res = response){

        let result = await this.postService.userFeed(req._user, req.query.page);

        res.json(result);
        
    }

    async show(req = request, res= response) {

        const id = parseInt(req.params.id);
        let result = await this.postService.showForUser(id, req._user);

        res.json(result)

    }

    async add(req = request, res= response) {

        let params = new StorePostRequest(req).validate();
        let post = await this.postService.addByUser(req._user, params);

        res.json(post)

    }

}


module.exports = new PostController();
