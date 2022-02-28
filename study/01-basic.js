import * as THREE from "../build/three.module.js";

class App {
	constructor() {
		// container을 가져옴
		// _은 private으로 정의
		const divContainer = document.querySelector("#webgl-container");
		this._divContainer = divContainer;

		// anitialias을 활성화하면 3차원 장면이 렌더링 될때 경계선이 부드럽게 표현됨
		const renderer = new THREE.WebGLRenderer({ antialias: true });

		// 픽셀의 Ratio(비율)값을 설정
		renderer.setPixelRatio(window.devicePixelRatio);

		// container의 자식으로 렌더러를 추가함
		// domElement는 캔버스 타입의 dom임
		divContainer.appendChild(renderer.domElement);
		this._renderer = renderer;

		// Scene 생성
		const scene = new THREE.Scene();
		this._scene = scene;

		// 카메라 메서드 호출
		this._setupCamera();

		// Light 메서드 호출
		this._setupLight();

		// 3차원 모델 메서드 호출
		this._setupModel();

		// 창크기가 변경될때 resize의 메서드를 정의
		// 렌더러나 카메라는 창이 변경될때마다 속성값을 변경해야 하기 때문
		// bind -> resize 메서드 안에서 this가 가르키는 객체가 이벤트 객체가 아닌 App클래스의 객체가 되도록하기 위함
		window.onresize = this.resize.bind(this);

		// 렌더러나 카메라를 창크기에 맞춰줌
		this.resize();

		// 실제로 3차원 그래픽 장면을 만들어주는 메서드
		// 적당한 시점에 최대한 빠르게 표현
		// 렌더 메서드 코드 안에서의 this가 app 클래스의 객체를 가르키게 하기 위함
		requestAnimationFrame(this.render.bind(this));
	}

	_setupCamera() {
		// 출력 크기를 가져오고
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		// 카메라 객체 생성
		const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
		camera.position.z = 2;

		// 필드객체 정의
		this._camera = camera;
	}

	_setupLight() {
		// 광원의 색상과 세기 값을 이용해서 만듬
		const color = 0xffffff;
		const intensity = 1;
		const light = new THREE.DirectionalLight(color, intensity);
		light.position.set(-1, 2, 4);
		this._scene.add(light);
	}

	_setupModel() {
		// 파란색 정육면체를 생성 형상을 정의
		// 가로 세로 깊이
		const geometry = new THREE.BoxGeometry(1, 1, 1);

		// 파란색 재질
		const material = new THREE.MeshPhongMaterial({ color: 0x44a88 });

		const cube = new THREE.Mesh(geometry, material);

		this._scene.add(cube);
		this._cube = cube;
	}

	resize() {
		const width = this._divContainer.clientWidth;
		const height = this._divContainer.clientHeight;

		// 카메라의 속성값을 가져오고
		this._camera.aspect = width / height;
		this._camera.updateProjectionMatrix();

		// 렌더러를 설정
		this._renderer.setSize(width, height);
	}

	// 렌더링이 처음 시작된 후의 시간 값
	render(time) {
		// 렌더링하라
		this._renderer.render(this._scene, this._camera);

		// 업데이트 안에서는 속성 값을 변경하면서 애니메이션 효과를 업데이트함
		this.update(time);
		requestAnimationFrame(this.render.bind(this));
	}

	update(time) {
		time *= 0.001; // 밀리세컨드를 초단위로 변경

		// 큐브의 x, y 축으로 계속 회전함
		// time은 requestAnimationFrame이 계속 전달해줌
		this._cube.rotation.x = time;
		this._cube.rotation.y = time;
	}
}

// 윈도우에 onload에서 App클래스를 생성함
window.onload = function () {
	new App();
};
