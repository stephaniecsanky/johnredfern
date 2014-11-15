if(!dojo.hostenv.findModule("xg.shared.Facebook",false)){
dojo.provide("xg.shared.Facebook");
xg.shared.Facebook=(function(){
var _1={};
var _={};
_.initCalled=false;
_.initFinished=false;
_.onConnectedListeners=[];
_.onNotConnectedListeners=[];
_.callIfDefined=function(_3){
if(_3){
_3();
}
};
_1.parseXfbml=function(_4){
xg.addOnFacebookLoad(function(){
FB.XFBML.parse(_4);
});
};
_1.requirePublishStreamPermission=function(_5,_6,_7,_8){
xg.addOnFacebookLoad(function(){
_1.requireSession(function(){
if(_7){
_.isUserPageAdmin(_7,function(){
_.requirePublishStreamPermissionProper(_5,_6,_7);
},function(){
_.disconnectUserFromPage();
_.callIfDefined(_8);
_.requirePublishStreamPermissionProper(_5,_6);
},function(){
_.callIfDefined(_6);
});
}else{
_.requirePublishStreamPermissionProper(_5,_6);
}
},function(){
_.callIfDefined(_6);
});
});
};
_1.requireManagePagesPermission=function(_9,_a){
xg.addOnFacebookLoad(function(){
_1.requireSession(function(){
_.requireManagePagesPermissionProper(_9,_a);
},function(){
_.callIfDefined(_a);
});
});
};
_.requireManagePagesPermissionProper=function(_b,_c){
_.userHasManagePagesPermission(function(_d){
if(_d){
_.callIfDefined(_b);
return;
}else{
_.showPermissionDialog("manage_pages,publish_stream",function(_e){
if(_e.authResponse){
_.callIfDefined(_b);
}else{
_.callIfDefined(_c);
}
});
}
});
};
_.userHasManagePagesPermission=function(_f){
FB.api("/me/permissions",function(_10){
var _11=_10&&_10.data&&_10.data[0]&&_10.data[0].manage_pages==1;
_f(_11);
});
};
_1.getLoginStatus=function(_12){
FB.getLoginStatus(_12);
};
_1.requireSession=function(_13,_14){
_14=_14||function(){
};
FB.getLoginStatus(function(_15){
if(_15.authResponse){
_13();
}else{
FB.login(function(_16){
if(_16.authResponse){
_13();
}else{
_14();
}
});
}
});
};
_1.logout=function(_17){
FB.logout(_17);
};
_1.getCurrentUid=function(){
return FB.getAuthResponse().userID;
};
_1.fqlQuery=function(_18,_19){
FB.api({method:"fql.query",query:_18},_19);
};
_1.getUserFields=function(uid,_1b,_1c){
var _1d="SELECT "+_1b.join(",")+" from user where uid="+uid;
return _1.fqlQuery(_1d,_1c);
};
_1.streamPublish=function(_1e,_1f,_20,_21,_22,_23){
FB.ui({method:"stream.publish",display:"iframe",user_message_prompt:_21,message:_1e,attachment:_1f,action_links:_20,from:_23},_22);
};
_1.publishPost=function(_24,_25){
_1.requireSession(function(){
if(_25==null){
FB.api("/me/feed","post",_24);
return;
}
FB.api("/me/accounts","get",{},function(_26){
for(var i=0;i<_26.data.length;i++){
if(_25==_26.data[i].id){
_24["access_token"]=_26.data[i].access_token;
break;
}
}
FB.api("/me/feed","post",_24);
});
});
};
_.showPermissionDialog=function(_28,_29){
xg.shared.util.alert({bodyHtml:xg.shared.nls.html("facebookWillOpen"),onOk:function(){
FB.login(_29,{scope:_28});
}});
};
_.isUserPageAdmin=function(_2a,_2b,_2c,_2d){
_1.requireManagePagesPermission(function(){
_1.fqlQuery("SELECT uid, page_id FROM page_admin WHERE uid=me() AND page_id = '"+_2a+"'",function(_2e){
if(!_2e||_2e.error_code){
_2d();
}else{
if(_2e.length>0){
_2b();
}else{
_2c();
}
}
});
},_2d);
};
_.disconnectUserFromPage=function(){
xg.post("/profiles/connections/update?xn_out=json",{pageId:"",pageName:"",userId:_1.getCurrentUid()},function(){
});
};
_.requirePublishStreamPermissionProper=function(_2f,_30,_31){
_.userHasPublishStreamPermission(function(_32){
if(_32){
_.callIfDefined(_2f);
return;
}else{
_.showPermissionDialog(_31?"publish_stream,manage_pages":"publish_stream",function(_33){
if(_33.authResponse){
_.callIfDefined(_2f);
}else{
_.callIfDefined(_30);
}
});
}
},_31);
};
_.userHasPublishStreamPermission=function(_34,_35){
FB.api("/me/permissions",function(_36){
var _37=_36&&_36.data&&_36.data[0]&&_36.data[0].publish_stream==1;
if(_35){
_37=_37&&_36.data[0].manage_pages==1;
}
_34(_37);
});
};
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.shared.EngagementUtil",false)){
dojo.provide("xg.shared.EngagementUtil");
xg.shared.EngagementUtil={addEngagementContextToParams:function(_1,_2){
var _3=x$(_2).attr("data-page-type");
if(_3){
_1["pageType"]=_3;
if(_3=="main"||_3=="profile"||_3=="group"){
var _4=xg.shared.util.getModule(_2);
var _5=_4?xg.shared.util.extractModuleName(_4):"";
if(_5){
_1["moduleName"]=_5;
}
}
}
return _1;
}};
}
if(!dojo.hostenv.findModule("xg.shared.CookieStore",false)){
dojo.provide("xg.shared.CookieStore");
xg.shared.CookieStore=(function(){
var _1={};
var _={};
var _3="xg_sc";
var _4="xg_pc";
var _5=366;
var _6={};
var _7={};
_.initialize=function(){
_1.reloadSessionCookie();
_1.reloadPersistentCookie();
};
_1.reloadSessionCookie=function(){
var _8=xg.shared.util.getCookie(_3);
if(_8){
try{
_6=x$.evalJSON(_8);
}
catch(e){
try{
_6=x$.evalJSON(decodeURIComponent(_8.replace(/\+/g," ")));
}
catch(e){
}
}
}
if(_6 instanceof Array){
_6={};
}
};
_1.reloadPersistentCookie=function(){
var _9=xg.shared.util.getCookie(_4);
if(_9){
try{
_7=x$.evalJSON(_9);
}
catch(e){
try{
_7=x$.evalJSON(decodeURIComponent(_9.replace(/\+/g," ")));
}
catch(e){
}
}
}
if(_7 instanceof Array){
_7={};
}
};
_1.setSessionCookieValue=function(_a,_b){
if(_b===null||_b.length===0){
delete _6[_a];
}else{
_6[_a]=_b;
}
_.setCookieProper(_3,x$.toJSON(_6),0);
};
_1.getSessionCookieValue=function(_c){
return _6[_c];
};
_1.setPersistentCookieValue=function(_d,_e){
if(_e===null||_e.length===0){
delete _7[_d];
}else{
_7[_d]=_e;
}
_.setCookieProper(_4,x$.toJSON(_7),_5);
};
_1.getPersistentCookieValue=function(_f){
return _7[_f];
};
_.setCookieProper=function(_10,_11,_12){
xg.shared.util.setCookie(_10,_11,_12,"."+window.location.hostname);
};
xg.addOnRequire(function(){
_.initialize();
});
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.shared.googleAnalytics",false)){
dojo.provide("xg.shared.googleAnalytics");
xg.shared.googleAnalytics=(function(){
var _={};
var _2={};
_2.trackPageview=function(_3){
if(typeof ning_gaq!="undefined"&&ning_gaq){
ning_gaq.push(["_ning_ga._trackPageview",_3]);
}
};
return _2;
})();
}
if(!dojo.hostenv.findModule("xg.index.like.likeButton",false)){
dojo.provide("xg.index.like.likeButton");
xg.index.like.likeButton=function($){
var _2="like";
var _3=false;
var _4=false;
return {initialize:function(){
$(".like-button a").click(xg.index.like.likeButton.clickButton);
$("a.view-liked").click(xg.index.like.likeButton.clickLikersLink);
xg.index.like.likeButton.processPendingLike();
},processPendingLike:function(){
var _5=xg.shared.CookieStore.getSessionCookieValue(_2);
xg.shared.CookieStore.setSessionCookieValue(_2,null);
if(!ning.CurrentProfile||!_5){
return;
}
$(".like-button a").each(function(){
$button=$(this);
if($button.attr("data-content-id")===_5){
xg.index.like.likeButton.postLike($button,true);
}
});
},clickButton:function(e){
e.preventDefault();
var _7=$(this);
if(!ning.CurrentProfile){
xg.shared.CookieStore.setSessionCookieValue(_2,_7.attr("data-content-id"));
window.location.href=_7.attr("data-sign-up-url");
return;
}
xg.index.like.likeButton.postLike(_7,!_7.hasClass("liked"));
},postLike:function(_8,_9){
if(_3){
return;
}
_3=true;
var _a=xg.shared.EngagementUtil.addEngagementContextToParams({contentId:_8.attr("data-content-id")},_8);
_a["logLike"]=_8.attr("data-log-like")==="0"?0:1;
var _b=_8.attr("data-like-url");
if(!_b){
_b="/main/like/like";
}
var _c=_8.attr("data-unlike-url");
if(!_c){
_c="/main/like/unlike";
}
xg.post(_9?_b:_c,_a,function(_d,_e){
_3=false;
xg.index.like.likeButton.ajaxCallback(_e,_8);
});
if(_9){
xg.shared.googleAnalytics.trackPageview("/like/ning/create/"+_8.attr("data-content-type")+"/"+_8.attr("data-content-id"));
}else{
xg.shared.googleAnalytics.trackPageview("/like/ning/delete/"+_8.attr("data-content-type")+"/"+_8.attr("data-content-id"));
}
},ajaxCallback:function(_f,_10){
if(_f.success){
_10.html(_f.likeButtonText);
if(_f.likeCount>0){
_10.parents(".likebox").find(".like-count").show();
}else{
_10.parents(".likebox").find(".like-count").hide();
}
_10.parents(".likebox").find(".view-liked").html(_f.likeCountText);
_10.toggleClass("liked");
}
},clickLikersLink:function(_11){
_11.preventDefault();
if(_4){
return;
}
_4=true;
xg.get("/main/like/likers",{contentId:$(this).attr("_id")},function(xhr,_13){
_4=false;
if(!_13.likers){
return;
}
var _14="<div class=\"people_liked_list\">";
x$.each(_13.likers,function(i,_16){
var _17=_16.online?"<span class=\"online\" title=\""+xg.index.nls.html("onlineProper")+"\">"+xg.index.nls.html("onlineProper")+"</span>":"";
_14+=" <div class=\"member_item\">     <div class=\"member_item_thumbnail\">         <a href=\""+xg.qh(_16.profileUrl)+"\">             <img height=\"45\" width=\"45\" class=\"xg_lightborder\" src=\""+xg.qh(_16.thumbnailUrl)+"\" alt=\""+xg.qh(_16.fullName)+"\">         </a>     </div>     <div class=\"member_item_detail\">         <h5><a href=\""+xg.qh(_16.profileUrl)+"\">"+xg.qh(_16.fullName)+"</a> "+_17+"</h5>     </div> </div>";
});
_14+="</div>";
xg.shared.util.alert({title:xg.index.nls.text("peopleWhoLikedThis"),bodyHtmlRaw:_14,okButtonText:xg.index.nls.text("close"),wideDisplay:true});
});
}};
}(x$);
xg.addOnRequire(function(){
xg.index.like.likeButton.initialize();
});
}
if(!dojo.hostenv.findModule("xg.index.facebookLike",false)){
dojo.provide("xg.index.facebookLike");
xg.index.facebookLike=(function(){
var _1={};
var _={};
var _3=0;
var _4=200;
var _5=false;
var _6;
_1.initialize=function(){
_6=x$(".facebook-like:first");
x$(".facebook-like").bind("mouseenter",function(){
_6=x$(this);
});
if(!_5){
_5=true;
xg.addOnFacebookLoad(function(){
FB.Event.subscribe("edge.create",function(_7){
if(new Date().getTime()-_3<_4){
return;
}
_3=new Date().getTime();
var _8=xg.shared.EngagementUtil.addEngagementContextToParams({contentId:_6.attr("data-content-id")},_6);
if(_6){
xg.post("/main/like/facebookLike",_8);
xg.shared.googleAnalytics.trackPageview("/like/facebook/create/"+_6.attr("data-content-type")+"/"+_6.attr("data-content-id"));
}
});
});
}
};
xg.addOnRequire(function(){
_1.initialize();
});
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.index.googlePlusOne",false)){
dojo.provide("xg.index.googlePlusOne");
xg.index.googlePlusOne=(function(){
var _1={};
var _={};
var _3;
_1.initialize=function(){
_3=x$(".google-plusone:first");
x$(".google-plusone").bind("mouseenter",function(){
_3=x$(this);
});
};
_1.onPlusOne=function(_4){
if(_4.state!="on"){
return;
}
var _5=xg.shared.EngagementUtil.addEngagementContextToParams({contentId:_3.attr("data-content-id")},_3);
if(_3){
xg.post("/main/like/googlePlusOne",_5);
xg.shared.googleAnalytics.trackPageview("/like/google/create/"+_3.attr("data-content-type")+"/"+_3.attr("data-content-id"));
}
};
xg.addOnRequire(function(){
_1.initialize();
});
return _1;
})();
xg_index_googlePlusOne_onPlusOne=xg.index.googlePlusOne.onPlusOne;
}
if(!dojo.hostenv.findModule("xg.shared.PostToFacebookLink",false)){
dojo.provide("xg.shared.PostToFacebookLink");
xg.shared.PostToFacebookLink=(function(){
var _1={};
var _={};
_1.initialize=function(){
x$(".xj_post_to_facebook").each(function(i,a){
if(x$(a).data("xj_initialized")){
return;
}
x$(a).data("xj_initialized",true);
x$(a).click(function(_5){
_5.preventDefault();
var _6=x$(this).attr("_title");
if(!_6){
_6=document.title;
}
var _7=x$.evalJSON(x$(this).attr("_log"));
xg.shared.util.track(_7.module,_7.page,_7.action,"facebookshare");
window.open("http://www.facebook.com/sharer.php?u="+encodeURIComponent(x$(this).attr("_url"))+"&t="+encodeURIComponent(_6),"facebook","toolbar=0,status=0,height=436,width=646,scrollbars=yes,resizable=yes");
var _8=x$(this).attr("_contentId");
if(_8){
xg.post("/main/sharing/track",{contentId:_8,service:"facebook"});
}
});
});
};
xg.addOnRequire(function(){
_1.initialize();
});
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.index.tweet.PostToTwitterLink",false)){
dojo.provide("xg.index.tweet.PostToTwitterLink");
xg.index.tweet.PostToTwitterLink=(function(){
var _1={};
var _={};
var _3=140;
var _4="#tw-share";
var _5="xg_tw";
_1.initialize=function(){
x$("a.post_to_twitter").each(function(i){
var _7=x$(this);
var _8=_7.attr("_message");
var _9=_7.attr("_url");
var _a=_7.attr("_source");
var _b=_7.attr("_urlShortenerKey");
var _c=_7.attr("_contentId");
if(_7.data("xj_initialized")){
return;
}
_7.data("xj_initialized",true);
if(_7.attr("_screenName")){
var _d=xg.shared.util.getCookie(_5);
if(_d&&window.location.hash==_4&&!_7.attr("_twitterAuthenticationNeeded")){
window.location.replace("#");
xg.shared.util.setCookie(_5,"");
_.postTwitterStatus(_d,_a,_c);
}
_7.click(function(_e){
dojo.event.browser.stopEvent(_e);
if(_.isDialogActive(_7)){
return;
}
dialog=_.showTwitterPostDialog(_7,_a,_c);
_.makeShortUrl(_9,_b,function(_f){
var _10=x$("textarea",dialog);
_10.val(_8+" "+(_f?_f:_9)).change();
_10.removeClass("busy_center");
_.enableDialogControls(dialog);
});
});
}else{
this.href="/main/tweet/create"+"?url="+encodeURIComponent(_9)+"&message="+encodeURIComponent(_8);
_7.click(function(_11){
if(_c){
xg.post("/main/sharing/track",{contentId:_c,service:"twitter"});
}
});
}
});
};
_.makeShortUrl=function(url,_13,_14){
xg.post("/profiles/shorturl/create",{url:url,key:_13,source:"twitter"},function(xhr,_16){
return _14(_16.url);
});
};
_.validate=function(_17){
var _18;
if(_17.message.value.length==0){
_18=xg.index.nls.html("postCannotBeEmpty");
}else{
if(_17.message.value.length>_3){
_18=xg.index.nls.html("postTooLong",_3);
}
}
return _18;
};
_.clearErrors=function(_19){
x$("div.xj_error",_19).hide();
};
_.showTwitterAuthenticationDialog=function(_1a){
xg.shared.util.confirm({title:xg.index.nls.html("connectToTwitter"),bodyHtml:xg.index.nls.html("toPostUpdates",ning.CurrentApp.name),okButtonText:xg.index.nls.html("connect"),onOk:function(){
_1a();
var _1b=window.location.pathname+window.location.search;
window.location="/profiles/connections/authenticateWithTwitter?callback="+_1b+escape(_4);
}});
};
_.showTwitterPostDialog=function(_1c,_1d,_1e){
var _1f="<div class=\"twitter-box\"><div class=\"xj_error errors\" style=\"display:none;\"></div><textarea class=\"busy_center\" name=\"message\" cols=\"30\" rows=\"3\"></textarea><div class=\"form-hint clear easyclear xj_hint_container hint_container\"><span class=\"char-limit xj_remaining_count\"><br></span></div></div>";
_.setDialogActive(_1c,true);
var _20=xg.shared.util.confirm({title:xg.index.nls.text("postToTwitter"),bodyHtml:_1f,noOverlay:true,position:"absolute",top:function(_21){
return _1c.offset().top+_1c.height()+parseInt(_21.height()/2)+5;
},left:function(_22){
return _1c.offset().left+parseInt(_22.width()/2);
},"margin-top":"auto","margin-left":"auto",closeOnlyIfOnOk:true,okButtonText:xg.index.nls.text("post"),onOk:dojo.lang.hitch(this,function(_23){
var _24=x$("form",_23)[0];
var _25=_.validate(_24);
if(_25){
x$("div.xj_error",_23).html(_25).show();
return false;
}
_.setDialogActive(_1c,false);
if(_1c.attr("_twitterAuthenticationNeeded")){
_.showTwitterAuthenticationDialog(function(){
xg.shared.util.setCookie(_5,_24.message.value);
});
return true;
}
_.postTwitterStatus(_24.message.value,_1d,_1e);
return true;
}),onCancel:dojo.lang.hitch(this,function(_26){
_.setDialogActive(_1c,false);
})});
x$("textarea",_20).bind("keyup",dojo.lang.hitch(this,function(_27){
var _28=x$("textarea",_20).val();
if(_28.length>0&&_28.length<=_3){
_.clearErrors(_20);
}
}));
_.disableDialogControls(_20);
xg.shared.util.setMaxLengthWithCount(x$("textarea",_20)[0],x$("span.xj_remaining_count",_20)[0],_3,{onNonNegative:_.clearErrors(_20),neverHideCount:true});
return _20;
};
_.disableDialogControls=function(_29){
x$("p.buttongroup",_29).hide().css({"margin":"0"});
};
_.enableDialogControls=function(_2a){
x$("p.buttongroup",_2a).show();
};
_.postTwitterStatus=function(_2b,_2c,_2d){
xg.post("/profiles/profile/setTwitterStatus",{xn_out:"json",status:_2b,source:_2c,contentId:_2d},function(xhr,_2f){
var _30=xg.index.nls.text("postHasBeenSent");
if(_2f.warning){
_30=_2f.warning;
}
xg.shared.util.alert({title:xg.index.nls.text("postToTwitter"),bodyHtml:_30,autoCloseTime:2000});
});
};
_.isDialogActive=function(_31){
return _31.activeDialog?true:false;
};
_.setDialogActive=function(_32,_33){
_32.activeDialog=_33?true:false;
};
xg.addOnRequire(function(){
_1.initialize();
});
return _1;
})();
}
if(!dojo.hostenv.findModule("xg.photo.photo.show",false)){
dojo.provide("xg.photo.photo.show");
xg.photo.photo.show={initializeRotateAction:function(){
var _1=x$("a.xj_rotate_link");
if(_1.length>0){
dojo.event.connect(_1[0],"onclick",dojo.lang.hitch(this,function(_2){
xg.stop(_2);
dojo.io.bind({url:_1.attr("_url"),method:"post",content:{},preventCache:true,mimetype:"text/json",encoding:"utf-8",load:dojo.lang.hitch(this,function(_3,_4,_5){
if("imageBlock" in _4){
x$("div.mainimg").html(_4.imageBlock);
}
})});
}));
}
},initializeKeys:function(){
var _6=this;
window.setInterval(function(){
_6.monitorHash(_6);
},100);
x$(document).keyup(_6.handleKey);
},initializePhotoLinks:function(){
var _7=this;
x$("#previous_photo_link").click(function(_8){
_8.preventDefault();
window.clickId=this.id;
_7.loadPhotoUrl(_7,this.href);
});
x$("#next_photo_link").click(function(_9){
_9.preventDefault();
window.clickId=this.id;
_7.loadPhotoUrl(_7,this.href);
});
x$(".next_photo_link").click(function(_a){
_a.preventDefault();
x$("#next_photo_link").click();
});
},loadPhotoUrl:function(_b,_c,_d){
if(!_c){
return;
}
var _e=_b.hashId(_c);
var _f=_b.cacheId(_c);
if(_b.cache[_f]){
if(!_d&&window.location.hash!="#"+_e){
_b.delayedSpinner();
window.location.hash=_e;
}
}else{
if(_b.cacheAka[_f]&&_b.cache[_b.cacheAka[_f]]){
var _10=_b.hashId(_b.cacheAka[_f]);
if(!_d&&window.location.hash!="#"+_10){
_b.delayedSpinner();
window.location.hash=_10;
}
}else{
if(_b.loading[_f]){
if(!_d&&window.location.hash!="#"+_e){
x$("div.photo").addClass("photo-spinner");
window.location.hash=_e;
}
}else{
_b.loading[_f]=true;
if(!_d){
x$("div.photo").addClass("photo-spinner");
}
xg.get(_c,{"xg_ps":1,"xg_token":window.xg.token},function(xhr,_12){
var _13=_b.cacheId(_12.url);
_b.cacheAka[_f]=_13;
_b.cache[_13]=_12;
if(_d){
var src=_12.html.match(/mainimg.*<img.*?src="([^\"]+)"/);
if(src){
_b.cacheImage(src[1]);
}
}else{
window.location.hash=_b.hashId(_12.url);
}
});
}
}
}
},delayedSpinner:function(_15){
if(!_15){
_15=1000;
}
var _16=x$("div.photo");
window.setTimeout(function(){
_16.addClass("photo-spinner");
},_15);
},relativeUrl:function(url){
if(!url){
return;
}
if(url.indexOf("http://")==0||url.indexOf("https://")==0){
return unescape(url.substr(url.indexOf("/",8)));
}
return unescape(url);
},cacheImage:function(src){
if(src&&!self.images[src]){
self.images[src]=new Image();
self.images[src].src=src;
}
},cacheId:function(str){
if(!str){
return;
}
if(str.indexOf("!")>=0){
return str.substr(str.indexOf("!")+1);
}
return this.relativeUrl(str);
},hashId:function(str){
if(!str){
return;
}
if(str.indexOf("!")>=0){
return str.substr(str.indexOf("!")+1);
}
return "!"+this.relativeUrl(str);
},handleKey:function(_1b){
var _1c={"INPUT":true,"input":true,"TEXTAREA":true,"textarea":true,"SELECT":true,"select":true};
if(_1c[_1b.target.nodeName]){
return true;
}
var _1d={"37":"#previous_photo_link","39":"#next_photo_link"};
var _1e=_1d[_1b.keyCode];
if(_1e){
_1b.preventDefault();
x$(_1e).click();
}
},monitorHash:function(_1f){
if(window.location.hash!=window.oldHash){
var _20=_1f.cache[_1f.cacheId(window.location.hash)];
if(!_20){
cacheId=_1f.cacheId(window.location.hash);
if(_1f.cacheAka[cacheId]&&_1f.cache[_1f.cacheAka[cacheId]]){
window.location.replace("#"+_1f.hashId(_1f.cacheAka[cacheId]));
}
return;
}
document.title=_20.title+" - "+ning.CurrentApp.name;
var _21=x$("<div id=\"photo_page_body\"></div>").html(_20.html);
_21.find(".photo-spinner").removeClass("photo-spinner");
_21.css({"display":"none"});
_1f.loadPhotoUrl(_1f,_21.find("#next_photo_link").attr("href"),true);
_1f.loadPhotoUrl(_1f,_21.find("#previous_photo_link").attr("href"),true);
if(window.clickId){
var _22={"previous_photo_link":"#next_photo_link","next_photo_link":"#previous_photo_link"};
var _23=window.oldHash?_1f.cacheId(window.oldHash):_1f.cacheId(window.location.href);
var _24=_21.find(_22[window.clickId]).attr("href");
_1f.cacheAka[_1f.cacheId(_24)]=_23;
}
var _25=x$("#photo_page_body");
_25.find(".inplace_edit:visible").find(".cancellink").click();
var _26=x$(".optionbox");
_26.removeClass("optionbox");
_25.append(_26);
var _27=_25.html();
var _28=function(){
_25.css({"display":"none"});
_21.css({"display":"block"});
_25.remove();
_21.find(".texteditor_toolbar").remove();
_21.find(".xj_follow_description").remove();
_1f.reinitializePageJavaScript(_1f);
};
if(_21.find("div.photo img.photo-loaded")[0]){
_25.before(_21);
_28();
}else{
_21.find("div.photo img").load(function(){
x$(this).addClass("photo-loaded");
_28();
});
_25.before(_21);
}
_1f.cache[_1f.cacheId(window.oldHash)].html=_27;
window.clickId=null;
window.oldHash=window.location.hash;
}
},initializeCache:function(){
if(!this.cache){
var _29={};
_29["html"]=x$("#photo_page_body").html();
_29["title"]=document.title;
var _2a=this.cacheId(window.location.href);
this.loading={};
this.images={};
this.cacheAka={};
this.cache={};
this.cache[_2a]=_29;
this.cache[undefined]=_29;
window.oldHash=window.location.hash;
this.loadPhotoUrl(this,x$("#next_photo_link").attr("href"),true);
this.loadPhotoUrl(this,x$("#previous_photo_link").attr("href"),true);
}
},initializeJsPhotoGallery:function(){
if(x$("#photo_page_body").attr("data-jsPhotoGallery")=="yes"){
this.initializeCache();
this.initializePhotoLinks();
this.initializeKeys();
}
},reinitializePageJavaScript:function(_2b){
_2b.initializePhotoLinks();
if(!_2b.javaScriptInitializationTimer){
_2b.javaScriptInitializationTimer=xg.shared.util.createQuiescenceTimer(300,function(){
_2b.reinitializePageJavaScriptProper(_2b);
});
}
_2b.javaScriptInitializationTimer.trigger();
},reinitializePageJavaScriptProper:function(_2c){
x$(".optionbox").remove();
try{
xg._loader.onDone();
_2c.reinitializeLikeButtons();
_2c.initializeRotateAction();
xg.shared.comment.initialize();
xg.shared.CommentForm.initialize();
xg.shared.StarRater(x$(".star-rater").eq(0));
xg.shared.editors.tinymce.TinyMCE.reinitialize();
xg.shared.PostToFacebookLink.initialize();
xg.index.tweet.PostToTwitterLink.initialize();
if(x$("a.xj_modify_link").length){
xg.photo.photo.aviary.enableModifyLink();
}
}
catch(e){
}
},reinitializeLikeButtons:function(){
if(x$(".facebook-like iframe").length===0){
xg.shared.Facebook.parseXfbml();
}
xg.index.like.likeButton.initialize();
xg.index.facebookLike.initialize();
if(window.gapi&&window.gapi.plusone){
gapi.plusone.go();
}
xg.index.googlePlusOne.initialize();
},initialize:function(){
this.initializeJsPhotoGallery();
this.initializeRotateAction();
},incrementViewCount:function(_2d){
window.setTimeout(dojo.lang.hitch(this,function(){
dojo.io.bind({url:"/index.php/"+xg.global.currentMozzle+"/photo/registershown",content:{id:_2d},method:"post",encoding:"utf-8",load:dojo.lang.hitch(this,function(_2e,_2f,_30){
})});
}),5000);
}};
xg.addOnRequire(function(){
xg.photo.photo.show.initialize();
});
}
