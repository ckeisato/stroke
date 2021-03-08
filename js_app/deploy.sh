rm -rf public
gulp build
cd public
git init
git add -A
git commit -m 'update stroke'
git push -f git@github.com:ckeisato/stroke.git master:gh-pages
