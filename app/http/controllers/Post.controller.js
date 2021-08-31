const {request, response} = require('express');
const WS = require('../../providers/WS');

class PostController {

    async userFeed (req = request, res = response){

        try {

            let result = await WS.post().userFeed(
                WS.user().fromToken(req._user),
                req.query.page
            );

            res.json(result);

        } catch (err) {
            res.status(err.code || 500).send(err.message);
        }
        
    }

    async show(req = request, res= response) {

        try {

            const id = parseInt(req.params.id);
            let user = WS.user().fromToken(req._user);
            let result = await WS.post(id).getByUser(user);

            res.json(result)

        } catch (err) {
            res.status(err.code || 500).send(err.message);
        }

    }

    async add(req = request, res= response) {

        // let storage = new Storage()
        // console.log(storage);

        try {

            let user = WS.user().fromToken(req._user);
            let params = {
                'type': parseInt(req.body.type),
                'title': req.body.title,
                'description': req.body.description,
                'thumbnail': req.files && req.files.thumbnail ? req.files.thumbnail : null,
            }

            let post = await WS.post().addByUser( user, params);

            res.json({'id': post.id()})

        } catch (err) {
            res.status(err.code || 500).send(err.message);
        }

    }

}


module.exports = new PostController();