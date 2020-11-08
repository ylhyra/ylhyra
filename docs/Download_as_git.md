https://github.com/Git-Mediawiki/Git-Mediawiki/blob/master/docs/User-manual.md


```sh
export PERL5LIB=/Applications/Xcode.app/Contents/Developer/usr/libexec/git/perl:/Applications/Xcode.app/Contents/Developer/usr/libexec/git/contrib/mw-to-git
export PERL_LWP_SSL_VERIFY_HOSTNAME=0 git pull

git clone -c remote.origin.shallow=true -c remote.origin.namespaces='(Main) Talk User Project Template MediaWiki Category Gadget Data Software Text Game Help' mediawiki::https://ylhyra.is

git config remote.origin.mwLogin ''
git config remote.origin.mwPassword ''
```

```sh
git pull origin master --rebase
```
