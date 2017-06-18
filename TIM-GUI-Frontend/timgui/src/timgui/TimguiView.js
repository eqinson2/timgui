define([
	"jscore/core",
	"text!./Timgui.html",
	"text!./Timgui.less"
	],function(core,template,styles){
		return core.View.extend({

			getTemplate:function(){
				return template;
			},
            getStyle:function(){
                return styles;
            },

            getActionBar: function(){
            	 return this.getElement().find('.elLayouts-QuickActionBar-items');
            },

	        getTopSection: function(){
	            return this.getElement().find(".ebBreadcrumbs");
	        }
		});
	});
