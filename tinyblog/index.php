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
        <div class="align-self-center">It looks like your blog is not yet set up. tinyblog uses MariaDB, so please ensure that it is installed on your system (<a href="https://downloads.mariadb.org/">MariaDB download page</a>).</div>
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
            <h3 class="display-5 h5">1.1. Specify database setup</h3>
            <div id="form-setup-db-choice-box">
              <button type="button" class="db-choice-selected">Automatic</button><button type="button">Custom</button>
            </div>
            <small id="form-setup-db-choice-info"></small>
          </div>

          <div id="form-blog-setup-database">
            <h2 class="display-5 h3">2. Enter your database details</h2>
            <div class="form-group">
              <label class="control-label" for="db-name">Name of database</label>
              <input type="text" name="db-name" class="form-control form-control" id="db-name" minlength="3" maxlength="64"  required/>
            </div>
            <div class="row">
              <div class="form-group col">
                <label class="control-label" for="db-user-name">Your database username</label>
                <input type="text" name="db-user-name" class="form-control form-control" id="db-user-name" minlength="3" maxlength="32" required/>
              </div>
              <div class="form-group col">
                <label class="control-label" for="db-user-pass">Your database password</label>
                <input type="password" name="db-user-pass" class="form-control form-control" id="db-user-pass" maxlength="32"/>
              </div>
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Submit</button>
          </div>
        </form>
      </section>
    <?php endif; ?>
  </main>

<style>
#no-blog-detected > * {
  margin: 5px 0px;
}

#form-blog-setup-general {
  margin-bottom: 30px;
}

#form-setup-db-choice-box {
  background-color: #eaeaea;
  border: 1px solid black;
  display: inline-block;
  margin-top: 10px;
  text-align: center;
  width: auto;
}

#form-setup-db-choice-box button {
  border: 0px;
  padding: 5px 10px;
}

#form-setup-db-choice-box button:active, .db-choice-selected {
  background-color: #ccc;
}

#form-setup-db-choice-info {
  padding-left: 5px;
}
</style>

<script>
$('document').ready(() => {
  const inputs = $('input[type=text], input[type=password]');

  inputs.each((index, el) => {
    // Programmatically add .input-count spans to each .form-group div
    $(el).parent().find('label').after(` <span class="input-count d-none">(<span class="input-count-num">${$(el).val().length}</span> / ${$(el).attr('maxlength')} chars)</span>`);

    // Add event handlers to make .input-count spans work as they should
    $(el).on('focus', evt => {
      const targ = evt.target;
      $(targ).parent().find('.input-count').removeClass('d-none');
      $(targ).parent().find('.input-count-num').text($(targ).val().length)
    })
    $(el).on('blur', evt => {
      $(evt.target).parent().find('.input-count').addClass('d-none');
    })
    $(el).on('input', evt => {
      const targ = evt.target;
      $(targ).parent().find('.input-count-num').text($(targ).val().length)
    })
  })

  // Programmatically add db-setup-choice info text to adjacent <small> element
  const dbChoicesInfo = {
    'automatic': 'The database is set up with basic credentials and no password, ideal for quick local testing.',
    'custom': 'You specify the credentials for the database. This is ideal in most situations.'
  }

  // Set up defaults for db-setup part of form
  const defaultDbSetupDisplay = () => {
    $('#form-setup-db-choice-info').text(dbChoicesInfo.automatic);
    $('#form-blog-setup-database').attr('style', 'opacity: 0.5;');
    $('#form-blog-setup-database input').attr('readonly', '');
    $('#form-blog-setup-database #db-name').val('tinyblog');
    $('#form-blog-setup-database #db-user-name').val('tinyblog_user');
    $('#form-blog-setup-database #db-user-pass').val('');
  }

  defaultDbSetupDisplay();

  // Add event handlers for automatic / manual database setup choices
  $('#form-setup-db-choice-box button').each((index, el) => {
    $(el).on('click', evt => {
      if ($(el).hasClass('db-choice-selected')) {
        return;
      }

      $('.db-choice-selected').removeClass('db-choice-selected');

      if (/automatic/i.test($(el).text())) {
        defaultDbSetupDisplay();
      } else if (/custom/i.test($(el).text())) {
        $('#form-setup-db-choice-info').text(dbChoicesInfo.custom);
        $('#form-blog-setup-database').removeAttr('style');
        $('#form-blog-setup-database input').removeAttr('readonly');
      }

      $(el).addClass('db-choice-selected');
    })
  })
})
</script>
<?php
include_once('./src/inc/footer.inc.php');
?>
