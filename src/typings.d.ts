declare module '@ckeditor/ckeditor5-build-classic' {
	const ClassicEditorBuild: any;
	export = ClassicEditorBuild;
}

// Add missing types for ngx-slick-carousel
declare interface JQuerySlickOptions {
	[key: string]: any;
}

declare interface JQuery {
	[key: string]: any;
}
