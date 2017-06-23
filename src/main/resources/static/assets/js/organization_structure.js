var labelType, useGradients, nativeTextSupport, animate;
var status = $('#page-status').attr('class');
(function () {
  var ua = navigator.userAgent,
      iStuff = ua.match(/iPhone/i) || ua.match(/iPad/i),
      typeOfCanvas = typeof HTMLCanvasElement,
      nativeCanvasSupport = (typeOfCanvas == 'object' || typeOfCanvas == 'function'),
      textSupport = nativeCanvasSupport
          && (typeof document.createElement('canvas').getContext('2d').fillText == 'function');
  //I'm setting this based on the fact that ExCanvas provides text support for IE
  //and that as of today iPhone/iPad current text support is lame
  labelType = (!nativeCanvasSupport || (textSupport && !iStuff)) ? 'Native' : 'HTML';
  nativeTextSupport = labelType == 'Native';
  useGradients = nativeCanvasSupport;
  animate = !(iStuff || !nativeCanvasSupport);
})();
var Log = {
  elem: false,
  write: function (text) {
    if (!this.elem)
      this.elem = document.getElementById('log');
    this.elem.innerHTML = text;
    this.elem.style.left = (500 - this.elem.offsetWidth / 2) + 'px';
  }
};

var canvasWidth
$(document).ready(function () {
  canvasWidth = document.getElementsByClassName('box-body')[0].offsetWidth * 0.7;
});

function init() {
  if (status === 'dynamic') {
    $.ajax({
      url: ctxPath + "be/user/user-tree/get",
      method: "POST",
      success: function (resp) {
        initJit(resp);
      }
    });
  } else {
    initJit();
  }
}

function initJit(json) {
  // init data
  if (!json) {
    var json = {
      id: "node02",
      name: "A经理",
      data: {
        dept: '总经理室',
        title: '董事长／总经理'
      },
      children: [{
        id: "node13",
        name: "B经理",
        data: {
          dept: '运营后援部',
          title: '经理'
        },
        children: [{
          id: "node24",
          name: "A员工",
          data: {
            dept: '运营后援部',
            title: '运营'
          },
        }, {
          id: "node222",
          name: "B员工",
          data: {
            dept: '运营后援部',
            title: '运营'
          },
        }]
      }, {
        id: "node125",
        name: "C会计",
        data: {
          dept: '财务管理部',
          title: '总账会计'
        },
      }, {
        id: "node165",
        name: "D经理",
        data: {
          dept: '总经理室',
          title: '执行董事'
        },
        children: [{
          id: "node266",
          name: "F经理",
          data: {
            dept: '数字产品部',
            title: '经理'
          },
        }, {
          id: "node283",
          name: "G经理",
          data: {
            dept: '人事行政部',
            title: '经理'
          },
        }]
      }, {
        id: "node1130",
        name: "E经理",
        data: {
          dept: '生物基因部',
          title: '经理'
        },
      }]
    };
  }
  //end
  //init Spacetree
  //Create a new ST instance
  var st = new $jit.ST({
    //id of viz container element
    injectInto: 'infovis',
    //set duration for the animation
    duration: 800,
    //set animation transition type
    transition: $jit.Trans.Quart.easeInOut,
    //set distance between node and its children
    levelDistance: 50,
    //enable panning
    Navigation: {
      enable: true,
      panning: true
    },
    orientation: 'top',

    width: canvasWidth,
    height: 400,

    config: {
      orientation: 'left'
    },
    //set node and edge styles
    //set overridable=true for styling individual
    //nodes or edges
    Node: {
      height: 100,
      width: 100,
      type: 'rectangle',
      color: '#ffffff',
      overridable: true,
      position: 'inherit'
    },

    Edge: {
      type: 'bezier',
      overridable: true
    },

    onBeforeCompute: function (node) {
      Log.write("正在加载 " + node.name);
    },

    onAfterCompute: function () {
      Log.write("加载完成");
    },

    //This method is called on DOM label creation.
    //Use this method to add event handlers and styles to
    //your node.
    onCreateLabel: function (label, node) {
      label.id = node.id;
      label.innerHTML = "<h4 style='text-align:center'>" + node.name + "</h4><h4 style='text-align:center'>" + node.data.dept + "</h4>" +
          "<h4 style='text-align:center'>" + node.data.title + "</h4>";
      label.onclick = function () {
        st.onClick(node.id);
      };
      //set label styles
      var style = label.style;
      style.width = 100 + 'px';
      style.height = 100 + 'px';
      style.cursor = 'pointer';
      style.fontSize = '0.8em';
      style.textAlign = 'center';
      style.paddingTop = '3px';
      style.margin = '5px';
      style.border = '1px'
    },

    //This method is called right before plotting
    //a node. It's useful for changing an individual node
    //style properties before plotting it.
    //The data properties prefixed with a dollar
    //sign will override the global node style properties.
    onBeforePlotNode: function (node) {
      //add some color to the nodes in the path between the
      //root node and the selected node.
      if (node.selected) {
        node.data.$color = "#ffffff";
        node.data.$border = '1px';
      }
      else {
        delete node.data.$color;
        //if the node belongs to the last plotted level
        if (!node.anySubnode("exist")) {
          //count children number
          var count = 0;
          node.eachSubnode(function (n) {
            count++;
          });
          //assign a node color based on
          //how many children it has
          node.data.$color = '#ffffff';
          node.data.$border = '1px';
        }
      }
    },

    //This method is called right before plotting
    //an edge. It's useful for changing an individual edge
    //style properties before plotting it.
    //Edge data proprties prefixed with a dollar sign will
    //override the Edge global style properties.
    onBeforePlotLine: function (adj) {
      if (adj.nodeFrom.selected && adj.nodeTo.selected) {
        adj.data.$color = "#3c8dbc";
        adj.data.$lineWidth = 1;
      }
      else {
        delete adj.data.$color;
        delete adj.data.$lineWidth;
      }
    }
  });

  //load json data
  st.loadJSON(json);
  //compute node positions and layout
  st.compute();
  //optional: make a translation of the tree
  st.geom.translate(new $jit.Complex(-200, 0), "current");
  //emulate a click on the root node.
  st.onClick(st.root);

}