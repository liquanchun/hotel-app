import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

import { TreeNode, TreeModel, TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions } from 'angular-tree-component';

import * as $ from 'jquery';
import * as _ from 'lodash';

const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
      alert(`context menu for ${node.data.name}`);
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
    },
    click: (tree, node, $event) => {
      $event.shiftKey
        ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event)
        : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
    },
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`),
  },
};

@Component({
  selector: 'app-sys-org',
  templateUrl: './org.component.html',
  styleUrls: ['./org.component.scss'],
})
export class OrgComponent implements OnInit, AfterViewInit {

  private isNewOrg: boolean;

  private selectedOrg: any;

  private newOrgName: string;

  nodes = [
    {
      expanded: true,
      name: 'root expanded',
      subTitle: 'the root',
      children: [
        {
          name: 'child1',
          subTitle: 'a good child',
          hasChildren: false
        }, {
          name: 'child2',
          subTitle: 'a bad child',
          hasChildren: false
        }
      ]
    },
    {
      name: 'root2',
      subTitle: 'the second root',
      children: [
        {
          name: 'child2.1',
          subTitle: 'new and improved',
          uuid: '11',
          hasChildren: false
        }, {
          name: 'child2.2',
          subTitle: 'new and improved2',
          children: [
            {
              uuid: 1001,
              name: 'subsub',
              subTitle: 'subsub',
              hasChildren: false
            }
          ]
        }
      ]
    },
    {
      name: 'asyncroot',
      hasChildren: true
    }
  ];



  customTemplateStringOptions: ITreeOptions = {
    // displayField: 'subTitle',
    isExpandedField: 'expanded',
    idField: 'uuid',
    //getChildren: this.getChildren.bind(this),
    actionMapping,
    nodeHeight: 23,
    allowDrag: (node) => {
      // console.log('allowDrag?');
      return true;
    },
    allowDrop: (node) => {
      // console.log('allowDrop?');
      return true;
    },
    useVirtualScroll: true,
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
  };

  constructor(private modalService: NgbModal, fb: FormBuilder) {
  }
  ngOnInit() {
    this.isNewOrg = true;
  }
  ngAfterViewInit() {

  }
  addNode(tree) {
  }

  onInitialized(tree) {
    tree.treeModel.expandAll();
    console.log(_.flattenDeep(this.nodes));
  }

  onEvent(event) {
    console.log(event);
  }

  onSaveOrg(tree) {
    let fnode = this.getNode(this.nodes, 'child2');
    fnode.children = [{name: 'child2.1',
      subTitle: 'new and improved',
      uuid: '112',
      hasChildren: false}];

    

    this.isNewOrg = !this.isNewOrg;
    if (this.isNewOrg) {
      if (this.newOrgName) {
        // TODO
        const focusNode = tree.treeModel.getFocusedNode();
        if (focusNode.hasChildren) {
          focusNode.children.push({
            id: 20,
            name: this.newOrgName,
          });
        } else {
          focusNode.children = [{
            id: 20,
            name: this.newOrgName,
          }];
        }
        tree.treeModel.update();
        this.newOrgName = '';
      } else {
        alert('子节点名称不能为空。');
      }
    }
  }
  // 删除选择的角色
  onDeleteOrg(tree) {

  }

  getNode(nodeArr: any, name: string) {
    let findNode: any = {};
    _.each(nodeArr, (f) => {
      if (f.name === name) {
        findNode = f;
      }
      if (f.children) {
        return this.getNode(f.children, name);
      }
    });

    return findNode;
  }
}
