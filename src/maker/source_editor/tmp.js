if (mw.config.get('wgPageName').startsWith('Project:Newsletter')) {
  $('.mw-parser-output').find('a[href^="/"]').each(function () {
    $(this).attr('href', 'https://ylhyra.is' + $(this).attr('href'))
  })
}
