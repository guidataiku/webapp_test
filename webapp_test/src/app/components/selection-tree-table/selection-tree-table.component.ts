import { Component, inject } from '@angular/core';
import { RDS_DIALOG_DATA, RdsDialogRef, RdsFlatTreeNode, RdsTreeControl, RdsTreeNode, RdsTreeDataSource, RdsTreeSelectionModel, RdsTreeFlattener } from '@rds/angular-components';


@Component({
  selector: 'app-selection-tree-table',
  templateUrl: './selection-tree-table.component.html',
  styleUrl: './selection-tree-table.component.scss'
})
export class SelectionTreeTableComponent {

  protected readonly marker: RegExp = /\${(.*?)\}/gi;

  protected readonly data: any = inject(RDS_DIALOG_DATA);

  public searchPattern: string = '';

  public treeData: RdsTreeNode[] = [
    {
      name: "Online Data",
      children: [
        { name: "Optcal density line slope" },
        { name: "Elapsed hours" }
      ]
    },
    {
      name: "Offline Data",
      children: [
        { name: "Optcal density line slope" },
        { name: "Elapsed hours" }
      ]
    }
  ];

  private dialog!: RdsDialogRef<any>;

  public treeControl = new RdsTreeControl<RdsFlatTreeNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  public hasChild(treeNode: RdsFlatTreeNode) {
    console.log(treeNode)
    return true;
  }
}
