<template>
  <div>
    <section class="cz-carousel cz-controls-lg">
      <div class="tns-outer" id="tns2-ow">
        <img src="images/theme/banner-edusing.jpg" />
      </div>
    </section>
    <div
      class="modal fade"
      id="video-modal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
            <!-- 16:9 aspect ratio -->
            <div class="embed-responsive embed-responsive-16by9">
              <iframe
                class="embed-responsive-item"
                src=""
                id="video"
                allowscriptaccess="always"
                allow="autoplay"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section
      class="container position-relative pt-3 pt-lg-0 pb-5 mt-lg-n10"
      style="z-index: 10"
    >
      <div class="row">
        <div class="col-xl-8 col-lg-9">
          <div class="card border-0 box-shadow-lg">
            <div class="card-body px-3 pt-grid-gutter pb-0">
              <div class="row no-gutters pl-1">
                <div class="col-sm-4 px-2">
                  <a
                    class="gallery-item rounded-lg mb-grid-gutter video-btn"
                    data-toggle="modal"
                    data-src="/video/gia-dinh.mp4"
                    data-target="#video-modal"
                    href="javascript:void(0)"
                    data-sub-html='<h6 class="font-size-sm text-light"></h6>'
                    ><img
                      src="images/theme/chu-de-gia-dinh.jpg"
                      alt="Gallery image"
                    />
                    <span class="gallery-item-caption">Chủ đề gia đình</span>
                  </a>
                </div>
                <div class="col-sm-4 px-2">
                  <a
                    class="gallery-item rounded-lg mb-grid-gutter video-btn"
                    data-toggle="modal"
                    data-src="/video/truong-hoc.mp4"
                    data-target="#video-modal"
                    href="javascript:void(0)"
                    data-sub-html='<h6 class="font-size-sm text-light"></h6>'
                    ><img
                      src="images/theme/chu-de-truong-hoc.jpg"
                      alt="Gallery image"
                    />
                    <span class="gallery-item-caption">Chủ đề trường học</span>
                  </a>
                </div>
                <div class="col-sm-4 px-2">
                  <a
                    class="gallery-item rounded-lg mb-grid-gutter video-btn"
                    data-toggle="modal"
                    data-src="/video/san-bay.mp4"
                    data-target="#video-modal"
                    href="javascript:void(0)"
                    data-sub-html='<h6 class="font-size-sm text-light"></h6>'
                    ><img
                      src="images/theme/chu-de-san-bay.jpg"
                      alt="Gallery image"
                    />
                    <span class="gallery-item-caption">Chủ đề sân bay</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="row no-gutters py-5" style="background-color: #f3f3f3c2">
      <div
        class="col-md-6 bg-position-center bg-size-cover bg-secondary"
        style="
          min-height: 15rem;
          background: url(images/about/esing-gioi-thieu.jpg) center center
            no-repeat;
          background-size: contain !important;
        "
      >
        <span class="split-section-arrow arrow-left"></span>
      </div>
      <div class="col-md-6 px-3 px-md-5">
        <div class="mx-auto" style="max-width: 35rem; text-align: left">
          <h2 class="h3 py-3">ESING-unso</h2>
          <p class="font-size-sm">
            <b>ESING-unso</b> là bộ giáo trình làm quen với tiếng Anh dành cho
            trẻ em lứa tuổi Mầm non với các ưu thế vượt trội được xây dựng bởi
            đội ngũ uy tín và có kinh nghiệm lâu năm trong lĩnh vực ngôn ngữ,
            công nghệ, âm nhạc, hình ảnh và tâm lý.
          </p>
          <p class="font-size-sm">Bộ giáo trình<b>ESING-unso</b>được biên soạn với nền tảng xem xét 5 yếu tố chính tạo nên sự phát triển toàn diện của trẻ:</p>
          <ul class="font-size-sm">
            <li>
              <b class="text-danger">Social (Xã hội) :</b>Phát triển khả năng làm việc theo nhóm, chơi/chia sẻ với những bạn khácthực hiện các quy định đơn giản trong sinh hoạt
            </li>
            <li>
              <b class="text-danger">Physics (Thể chất) :</b> Thực hiện các vận
              động cơ bản, hoạt động yêu cầu sự kết hợp khéo léo của bàn
              tay-ngón tay; có tố chất vận động cơ bản yêu cầu sự khéo léo,
              nhanh nhẹn, thăng bằng
            </li>
            <li>
              <b class="text-danger">Intellectual (Nhận thức) :</b> Có kiến thức
              và hiểu biết cơ bản về bản thân và thế giới xung quanh, Có khả
              năng quan sát, nhận xét và ghi nhớ sự vật/sự việc/hiện tượng xung
              quanh
            </li>
            <li>
              <b class="text-danger">Creative (Tính sáng tạo) :</b>Phát triển khả năng diễn đạt và trí tưởng tượng của trẻ nhỏ
            </li>
            <li>
              <b class="text-danger">Emotional (Tình cảm) :</b>Phát triển khả năng tự nhận thức, tự tin, cảm nhận và biểu lộ cảm xúc với con người và sự vật gần gũi
            </li>
          </ul>
          <a class="btn btn-info btn-shadow" href="/esing-unso">Chi tiết hơn</a>
        </div>
      </div>
    </section>

    <section class="container pb-5 mb-md-3">
      <h2 class="h3 text-center pt-5">CÁC CHƯƠNG TRÌNH HỌC</h2>
      <div class="row pt-4 mx-n2">
        <div class="col-xl-12 col-lg-12">
          <div class="card border-0 box-shadow-lg">
            <div class="card-body px-3 pt-grid-gutter pb-0">
              <div class="row no-gutters pl-1">
                <div class="col-sm-4 px-2 mb-grid-gutter">
                  <a
                    class="d-block text-center text-decoration-none mr-1"
                    href="#"
                  >
                    <img
                      class="d-block rounded mb-3"
                      src="images/courses/level1.jpg"
                    />
                    <h3 class="font-size-base py-1 mb-0">
                      CHƯƠNG TRÌNH LEVEL 1
                    </h3>
                  </a>
                </div>
                <div class="col-sm-4 px-2 mb-grid-gutter">
                  <a
                    class="d-block text-center text-decoration-none mr-1"
                    href="#"
                  >
                    <img
                      class="d-block rounded mb-3"
                      src="images/courses/level2.jpg"
                    />
                    <h3 class="font-size-base py-1 mb-0">
                      CHƯƠNG TRÌNH LEVEL 2
                    </h3>
                  </a>
                </div>
                <div class="col-sm-4 px-2 mb-grid-gutter">
                  <a
                    class="d-block text-center text-decoration-none mr-1"
                    href="#"
                  >
                    <img
                      class="d-block rounded mb-3"
                      src="images/courses/level3.jpg"
                    />
                    <h3 class="font-size-base py-1 mb-0">
                      CHƯƠNG TRÌNH LEVEL 3
                    </h3>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { $themeConfig } from '@themeConfig'

export default {
  created() {
    document.title = `Trang chủ${$themeConfig.app.appName}`
  }
};
</script>

<style>
</style>