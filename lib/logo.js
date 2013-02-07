var cconsole = require('colorize').console;

var logo = function() {
    return '' +
    '                                                                 #green[]   .+ I+.        \n' +
    '                                                 #green[         :$ $I ] . +7 7 ^        \n' +
    '                                                 #green[      ,=I,I.... ]?  7            \n' +
    '                                                 #green[      : $?I...  $ ,             ]\n' +
    '                                                     ,7   7  #green[..7 7]               \n' +
    '                                                 =I    , ,+ : #green[ I,7]               \n' +
    '                                             II   :I   $ , I #green[  ?]                 \n' +
    '                                         ,7   ~I     Z     #green[   7 ,]                \n' +
    '                                     ,7   7I           #green[   $ 7 7                  ]\n' +
    '                                  7?  ?I,             #green[   ,,, ,+  $               ]\n' +
    '                              7?  ,7,               #green[     ~ ,  ,  :               ]\n' +
    '                          ,7,   7                 #green[     $, ,   7 , 7,             ]\n' +
    '                        I    7                  #green[    +,,     , +,    $,           ]\n' +
    '                    +I    7                    #green[   7 $       $      $   $,        ]\n' +
    '                 =7    $:                    #green[    ? $   $7=7$          :  $,      ]\n' +
    '              =7   $+                      #green[    $=,    ,               =   ,      ]\n' +
    '         , 7~  7I                       #green[     7                            ..?    ]\n' +
    '       7,   +7                          #green[    I                            ...     ]\n' +
    '   $~    7+                             #green[    =   I           X     +      ,7..7   ]\n' +
    '+7    =I                                #green[       ,,      I                 ....7   ]\n' +
    '7,7,?                                   #green[               ,                 ...,=   ]\n' +
    '  ,                                     #green[    I                          .....     ]\n' +
    '                                         #green[    ~~=            $        ...... 7    ]\n' +
    '                                          #green[   :$ZZ    ~            $.....,Z?$I   ]\n' +
    '                                          #green[     ,?$              $....,O7+7$     ]\n' +
    '                                            #green[      ,,7I:$$$ZZ$$$$ZOZ+I$           ]\n' +
    '                                              #green[         ^^....,,+?^^              ]';
};

module.exports = {
    welcome: function() {
        console.log('\n\n\n\t\t\tWelcome to Baggit!');
        var txt = logo();
        cconsole.log(txt.replace('X', ' '));
        console.log('\n\n\n');
    },
    file: function(file) {
        console.log('\n\n\n\t\t\tWe\'ll Baggit ASAP!');
        var txt = logo();
        var index = txt.indexOf('X');
        var before = txt.substr(0, index - Math.floor(file.length / 2));
        var after = txt.substr(index + Math.ceil(file.length / 2));
        cconsole.log(before + ']#black[' + file + ']#green[' + after);

        console.log('\n\n\n');
    }
};