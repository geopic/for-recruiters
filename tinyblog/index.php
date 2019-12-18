<?php
/**
 * tinyblog/index.php
 * The index file for the 'tinyblog' project in the 'for-recruiters' repository.
 * © George Pickering 2019, https://github.com/geopic
 */

include_once('./src/inc/header.inc.php');
?>
  <main>
    <?php if (isset($_Blog)): ?>
      <div class="container d-flex flex-column flex-wrap" id="blog-detected">
        Blog is detected.
      </div>
    <?php else: ?>
      <section class="container d-flex flex-column flex-wrap" id="no-blog-detected">
        <div class="align-self-center">It looks like this blog is not yet set up. tinyblog uses MariaDB, so please ensure that it is installed on your system (<a href="https://downloads.mariadb.org/">MariaDB download page</a>).</div>
        <div class="align-self-center">Please follow the steps below to set up your blog.</div>
        <form action="./src/inc/setupblog.inc.php" method="post" id="form-blog-setup">
          <div id="form-blog-setup-general">
            <h2 class="display-5 h3">1. Enter your blog details</h2>
            <div class="form-group">
              <label for="blog-name">Blog title</label>
              <input type="text" name="blog-name" class="form-control form-control-lg" id="blog-name" minlength="3" maxlength="64" required/>
            </div>
            <div class="row">
              <div class="form-group col">
                <label for="user-name">Your username</label>
                <input type="text" name="user-name" class="form-control form-control-sm" id="user-name" minlength="3" maxlength="32" required/>
              </div>
              <div class="form-group col">
                <label for="user-pass">Your password</label>
                <input type="password" name="user-pass" class="form-control form-control-sm" id="user-pass" minlength="3" maxlength="32" required/>
              </div>
            </div>
          </div>
          <div id="form-blog-setup-database panel">
            <h2 class="display-5 h3">2. Enter your database details</h2>
            <div>
              
            </div>
            <div class="form-group">
              <label class="control-label" for="db-name">Name of database</label>
              <input type="text" name="db-name" class="form-control form-control" id="db-name" minlength="3" maxlength="64" value="tinyblog" required/>
            </div>
            <div class="row">
              <div class="form-group col">
                <label class="control-label" for="db-user-name">Your database username</label>
                <input type="text" name="db-user-name" class="form-control form-control" id="db-user-name" minlength="3" maxlength="32" value="tinyblog_user" required/>
              </div>
              <div class="form-group col">
                <label class="control-label" for="db-user-pass">Your database password</label>
                <input type="password" name="db-user-pass" class="form-control form-control" id="db-user-pass" minlength="3" maxlength="32" required/>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button type="submit">Submit</button>
          </div>
        </form>
      </section>
    <?php endif; ?>
  </main>

<style>
#no-blog-detected > * {
  margin: 5px 0px;
}
</style>

<script>
$('document').ready(() => {
  const inputs = $('input[type=text], input[type=password]');

  // Programmatically add .input-count spans to each .form-group div
  inputs.each((index, el) => {
    $(el).parent().find('label').after(` <span class="input-count d-none">(<span class="input-count-num">${$(el).val().length}</span> / ${$(el).attr('maxlength')} chars)</span>`);
  })

  // Add event handlers to make .input-count spans work as they should
  $('input[type=text], input[type=password]').each((index, el) => {
    $(el).on('focus', evt => {
      $(evt.target).parent().find('.input-count').removeClass('d-none');
    })
    $(el).on('blur', evt => {
      $(evt.target).parent().find('.input-count').addClass('d-none');
    })
    $(el).on('input', evt => {
      const targ = evt.target;
      $(targ).parent().find('.input-count-num').text($(targ).val().length)
    })
  })
})
</script>
<?php
include_once('./src/inc/footer.inc.php');
?>
