rm -rf public
gulp build
cd public
git init
git add -A
git commit -m 'update movieReviews'
git push -f git@github.com:ckeisato/movieReviews.git master:gh-pages
