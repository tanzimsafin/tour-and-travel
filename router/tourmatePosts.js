const express = require('express');
const router = express.Router();
const tourmatePosts = require('../controller/tourmatePost');
const { isLoggedIn, isOwner, validateTourmatePost } = require('../middleware');

router.route('/')
    .get(tourmatePosts.index)
    .post(isLoggedIn, validateTourmatePost, tourmatePosts.createPost);

router.get('/new', isLoggedIn, tourmatePosts.renderNewForm);

router.route('/:id')
    .get(tourmatePosts.showPost)
    .put(isLoggedIn, isOwner, validateTourmatePost, tourmatePosts.updatePost)
    .delete(isLoggedIn, isOwner, tourmatePosts.deletePost);

router.get('/:id/edit', isLoggedIn, isOwner, tourmatePosts.renderEditForm);

router.get('/alltourmatepost', tourmatePosts.renderTourmatePool);

module.exports = router;