<!--
/**
 * tinyblog/index.php
 * The index file for the 'tinyblog' project in the 'for-recruiters' repository.
 * © George Pickering 2019, https://github.com/tedjenkins
 */
-->

<?php
include_once('./src/inc/header.inc.php');
?>
  <main>
    <?php if (true): ?>
      <section class="container d-flex flex-column flex-wrap" id="no-blog-detected">
        <div class="align-self-center">It looks like this blog is not yet set up. Please follow the steps below to set up your blog.</div>
        <form action="./src/inc/setupblog.inc.php" method="post">
          <div id="form-blog-setup-general">
            <h2 class="display-5">Blog details</h2>
            <div class="form-group">
              <label for="blog-name">Name of blog</label>
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
          <div id="form-blog-setup-database">
            <h2 class="display-5">Database details</h2>
            <div class="form-group">
              <label for="db-name">Name of database</label>
              <input type="text" name="db-name" class="form-control form-control" id="db-name" minlength="3" maxlength="64" value="tinyblog" required/>
            </div>
            <div class="row">
              <div class="form-group col">
                <label for="db-user-name">Username</label>
                <input type="text" name="db-user-name" class="form-control form-control" id="db-user-name" minlength="3" maxlength="32" value="tinyblog_user" required/>
              </div>
              <div class="form-group col">
                <label for="db-user-pass">Password</label>
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
<?php
include_once('./src/inc/footer.inc.php');
?>
