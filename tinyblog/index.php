<?php
include_once('./src/inc/header.inc.php');
?>
  <main>
    <?php if (true): ?>
      <section class="container" id="no-blog-detected">
        It looks like this blog is not yet set up. Please follow the steps below to set up your blog.
        <h2 class="display-5">Create blog</h2>
        <form action="./src/inc/setupblog.inc.php" method="post">
          <div class="form-group">
            <label for="blog-name">Name of blog</label>
            <input type="text" name="blog-name" class="form-control form-control-lg" id="blog-name" minlength="3" maxlength="64" required/>
          </div>
          <div class="form-group">
            <label for="user-name">Username</label>
            <input type="text" name="user-name" class="form-control form-control-sm" id="user-name" minlength="3" maxlength="32" required/>
          </div>
          <div class="form-group">
            <label for="user-pass">Password</label>
            <input type="password" name="user-pass" class="form-control form-control-sm" id="user-pass" minlength="3" maxlength="32" required/>
          </div>
          <button type="submit">Submit</button>
        </form>
      </section>
    <?php endif; ?>
  </main>
<?php
include_once('./src/inc/footer.inc.php');
?>