/* ============================================================
   交互逻辑：
   1. 根据 PROJECTS 数据渲染杂志式项目列表
   2. 顶部导航滚动状态 / 移动端菜单
   3. 滚动显现动画 & 当前区块导航高亮
   ============================================================ */

(function () {
  'use strict';

  /* ---------- 工具：项目封面图地址 ---------- */
  function imageUrl(project) {
    // 如果数据里已经是真实图片路径 / http 地址，则直接使用
    if (/^(https?:)?\/\//.test(project.image) || project.image.startsWith('images/')) {
      return project.image;
    }
    const sizeMap = {
      feature: 'landscape_16_9',
      split: 'landscape_4_3',
      wide: 'square'
    };
    return 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image'
      + '?prompt=' + encodeURIComponent(project.image)
      + '&image_size=' + (sizeMap[project.layout] || 'landscape_4_3');
  }

  /* ---------- 渲染项目 ---------- */
  function renderWorks() {
    const list = document.getElementById('worksList');
    let splitCount = 0; // 用于 split 模板左右交错

    const html = PROJECTS.map(function (p, i) {
      const no = String(i + 1).padStart(2, '0');
      const flipClass = p.layout === 'split'
        ? (splitCount++ % 2 === 1 ? ' work--flip' : '')
        : '';

      // wide 模板：编号放在正文；其余模板：编号叠在大图上
      const mediaNo = p.layout === 'wide' ? '' : '<span class="work__no" aria-hidden="true">' + no + '</span>';
      const headNo = p.layout === 'wide' ? '<span class="work__no" aria-hidden="true">' + no + '</span>' : '';

      const media =
        '<div class="work__media">'
        + '<img src="' + imageUrl(p) + '" alt="' + p.title + '项目封面" loading="lazy">'
        + mediaNo
        + '</div>';

      const body =
        '<div class="work__body">'
        +   '<div class="work__head">'
        +     headNo
        +     '<div class="work__meta">'
        +       '<span class="tag">' + p.category + '</span>'
        +       '<span class="work__date">' + p.date + '</span>'
        +     '</div>'
        +     '<h3 class="work__title">' + p.title + '</h3>'
        +   '</div>'
        +   '<div class="work__detail">'
        +     '<p class="work__desc">' + p.desc + '</p>'
        +     '<div class="work__tech">'
        +       '<span class="work__tech-label">技术栈 TECH STACK</span>'
        +       '<p>' + p.tech.join('　／　') + '</p>'
        +     '</div>'
        +   '</div>'
        + '</div>';

      return '<article class="work work--' + p.layout + flipClass + '">'
        + media + body
        + '</article>';
    }).join('');

    list.innerHTML = html;
  }

  /* ---------- 顶部导航：滚动后加背景 ---------- */
  function initHeader() {
    const header = document.getElementById('siteHead');
    const onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 移动端菜单 ---------- */
  function initMobileMenu() {
    const btn = document.getElementById('menuBtn');
    const links = document.getElementById('navLinks');

    function closeMenu() {
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', '打开菜单');
      document.body.classList.remove('menu-open');
    }

    btn.addEventListener('click', function () {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.setAttribute('aria-label', open ? '打开菜单' : '关闭菜单');
      document.body.classList.toggle('menu-open', !open);
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 760) closeMenu();
    });
  }

  /* ---------- 滚动显现 + 导航高亮 ---------- */
  function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');

    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // 项目是渲染后插入的，单独观察；错开一点更有翻阅感
    const workObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          workObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('.work').forEach(function (el) { workObserver.observe(el); });

    // 当前区块对应的导航链接高亮
    var navMap = {};
    document.querySelectorAll('.nav__link').forEach(function (link) {
      var id = link.getAttribute('href').slice(1);
      navMap[id] = link;
    });

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = navMap[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          document.querySelectorAll('.nav__link').forEach(function (l) { l.classList.remove('is-active'); });
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (sec) {
      activeObserver.observe(sec);
    });
  }

  /* ---------- 页脚年份 ---------- */
  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- 启动 ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    renderWorks();
    initHeader();
    initMobileMenu();
    initReveal();
    initYear();
  });
})();
