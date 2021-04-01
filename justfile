publish:
    git push origin master
    git subtree push --prefix dist origin gh-pages

build:
    npm run esdev

watch:
    cd dist
    reload
