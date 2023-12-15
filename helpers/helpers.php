<?php

  function replace_session_variables( $sql ) {
    $arrContainer = array();
    $arrVariable = array();
    $boolStart = false;
    $intLength = 0;
    $strReturn = $sql;

    for ( $i = 0; $i < strlen( $sql ); $i++ ) {
      if ( $boolStart ) { $intLength++; }

      if ( substr( $sql, $i, 1 ) == '$' ) {
        if ( $boolStart ) {
          array_push( $arrVariable, $intLength + 1 );
          array_push( $arrContainer, $arrVariable );
          $arrVariable = array();
          $boolStart = false;
          $intLength = 0;
        }
        else {
          array_push( $arrVariable, $i );
          $boolStart = true;
        }
      }
    }

    for ( $i = 0; $i < count( $arrContainer ); $i++ ) {
      $strName = substr( $sql, $arrContainer[$i][0] + 1, $arrContainer[$i][1] - 2 );
      $strReplace = substr( $sql, $arrContainer[$i][0], $arrContainer[$i][1] );

      $strReturn = str_replace( $strReplace , $_SESSION[ $strName ], $strReturn );
    }

    return $strReturn;
  }

?>