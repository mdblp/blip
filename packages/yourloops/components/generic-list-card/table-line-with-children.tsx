import Box from '@mui/material/Box'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import React, { type FC, PropsWithChildren } from 'react'

interface TableLineWithChildrenProps extends PropsWithChildren {
  hideDivider?: boolean
}

export const TableLineWithChildren: FC<TableLineWithChildrenProps> = (props) => {
  const { hideDivider, children } = props

  return (
    <ListItem divider={!hideDivider} className="list-item">
      <ListItemText>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between"
          }}
        >
          {children}
        </Box>
      </ListItemText>
    </ListItem>
  )
}
